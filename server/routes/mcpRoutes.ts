
import express from 'express';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { server } from '../mcp.js';
import crypto from 'crypto';

const router = express.Router();

const transports = new Map<string, SSEServerTransport>();

// GET /sse - Client establishes SSE connection here
router.get('/sse', async (req, res) => {
    console.log('New MCP SSE connection attempt');

    // Generate a unique session ID for this connection
    const sessionId = crypto.randomUUID();
    console.log(`New MCP SSE session: ${sessionId}`);

    // Create transport. The first argument is the endpoint where clients should POST messages.
    // We explicitly include the sessionId query param so we can route back to this transport.
    // Note: This URL must be reachable by the client. In some setups, this might need to be a full URL.
    // For now, relative path usually works if the client handles it correctly, or we assume specific structure.
    const transport = new SSEServerTransport(`/api/mcp/messages?sessionId=${sessionId}`, res);

    transports.set(sessionId, transport);

    await server.connect(transport);

    // Clean up when connection closes
    req.on('close', () => {
        console.log(`MCP SSE session closed: ${sessionId}`);
        transports.delete(sessionId);
    });
});

// POST /messages - Client sends JSON-RPC messages here
router.post('/messages', async (req, res) => {
    const sessionId = req.query.sessionId as string;
    if (!sessionId) {
        res.status(400).send("Missing sessionId");
        return;
    }

    const transport = transports.get(sessionId);
    if (!transport) {
        res.status(404).send("Session not found");
        return;
    }

    await transport.handlePostMessage(req, res);
});

export default router;
