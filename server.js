import { randomUUID } from "node:crypto";
import { createReadStream } from "node:fs";
import { access, readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { DefaultAzureCredential } from "@azure/identity";
import { TableClient } from "@azure/data-tables";

const port = Number(process.env.PORT || 3001);
const tableName = process.env.AZURE_TABLE_NAME || "PetYearbookComments";
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const endpoint = process.env.AZURE_STORAGE_TABLE_ENDPOINT
  || (accountName && `https://${accountName}.table.core.windows.net`);
const partitionKey = "yearbook";
const distDirectory = resolve(fileURLToPath(new URL("./dist", import.meta.url)));

const tableClient = endpoint
  ? new TableClient(endpoint, tableName, new DefaultAzureCredential())
  : null;
let developmentComments = [];

if (!tableClient) {
  console.warn(
    "Azure storage settings are missing; using temporary in-memory comments for local development.",
  );
}

const sendJson = (response, statusCode, data) => {
  response.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(data));
};

const readRequestBody = async (request) => {
  const chunks = [];
  let size = 0;

  for await (const chunk of request) {
    size += chunk.length;
    if (size > 16 * 1024) {
      throw new Error("Request body is too large");
    }
    chunks.push(chunk);
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
};

const toComment = (entity) => ({
  id: entity.rowKey,
  text: entity.text,
  font: entity.font,
  color: entity.color,
  page: Number(entity.page),
});

const handleApi = async (request, response, url) => {
  if (url.pathname === "/api/comments" && request.method === "GET") {
    if (!tableClient) {
      sendJson(response, 200, developmentComments);
      return true;
    }

    const comments = [];
    const entities = tableClient.listEntities({
      queryOptions: { filter: `PartitionKey eq '${partitionKey}'` },
    });

    for await (const entity of entities) {
      comments.push(toComment(entity));
    }

    comments.sort((left, right) => left.id.localeCompare(right.id));
    sendJson(response, 200, comments);
    return true;
  }

  if (url.pathname === "/api/comments" && request.method === "POST") {
    const body = await readRequestBody(request);
    const text = typeof body.text === "string" ? body.text.trim() : "";
    const page = Number(body.page);

    if (!text || !Number.isInteger(page) || page < 0 || page > 11) {
      sendJson(response, 400, { error: "Invalid comment" });
      return true;
    }

    const comment = {
      partitionKey,
      rowKey: randomUUID(),
      text: text.slice(0, 1000),
      font: typeof body.font === "string" ? body.font.slice(0, 200) : "Georgia, serif",
      color: typeof body.color === "string" ? body.color.slice(0, 20) : "#292722",
      page,
    };

    if (tableClient) {
      await tableClient.createEntity(comment);
    } else {
      developmentComments.push(toComment(comment));
    }

    sendJson(response, 201, toComment(comment));
    return true;
  }

  if (url.pathname.startsWith("/api/comments/") && request.method === "DELETE") {
    const rowKey = decodeURIComponent(url.pathname.slice("/api/comments/".length));
    if (tableClient) {
      await tableClient.deleteEntity(partitionKey, rowKey);
    } else {
      developmentComments = developmentComments.filter((comment) => comment.id !== rowKey);
    }

    response.writeHead(204);
    response.end();
    return true;
  }

  return false;
};

const serveStatic = async (request, response, url) => {
  const requestedPath = url.pathname === "/" ? "/index.html" : url.pathname;
  const filePath = resolve(distDirectory, `.${normalize(requestedPath)}`);

  if (!filePath.startsWith(distDirectory)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    await access(filePath);
    const extension = extname(filePath);
    const contentType = {
      ".css": "text/css",
      ".html": "text/html",
      ".js": "text/javascript",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".svg": "image/svg+xml",
    }[extension] || "application/octet-stream";

    response.writeHead(200, { "Content-Type": contentType });
    createReadStream(filePath).pipe(response);
  } catch {
    const index = await readFile(join(distDirectory, "index.html"));
    response.writeHead(200, { "Content-Type": "text/html" });
    response.end(index);
  }
};

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host}`);
    const handled = url.pathname.startsWith("/api/")
      ? await handleApi(request, response, url)
      : false;

    if (!handled) {
      await serveStatic(request, response, url);
    }
  } catch (error) {
    console.error(error);
    sendJson(response, 500, { error: "Request failed" });
  }
});

if (tableClient) {
  await tableClient.createTable();
}
server.listen(port, () => {
  console.log(`Pet yearbook server listening on port ${port}`);
});
