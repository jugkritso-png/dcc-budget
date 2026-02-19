
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import prisma from "./lib/prisma";

// Create an MCP server
const server = new McpServer({
    name: "Budget Manager MCP Server",
    version: "1.0.0"
});

// --- Resources ---

// Resource: List all budget categories
server.resource(
    "budget-categories",
    "budget://categories",
    async (uri) => {
        const categories = await prisma.category.findMany();
        return {
            contents: [{
                uri: uri.href,
                text: JSON.stringify(categories, null, 2)
            }]
        };
    }
);

// Resource: List all budget requests
server.resource(
    "budget-requests",
    "budget://requests",
    async (uri) => {
        const requests = await prisma.budgetRequest.findMany({
            include: {
                subActivity: true,
                expenseItems: true
            },
            orderBy: { createdAt: 'desc' },
            take: 50 // Limit to recent requests
        });
        return {
            contents: [{
                uri: uri.href,
                text: JSON.stringify(requests, null, 2)
            }]
        };
    }
);

// Resource: List all expenses
server.resource(
    "budget-expenses",
    "budget://expenses",
    async (uri) => {
        const expenses = await prisma.expense.findMany({
            include: { category: true },
            orderBy: { createdAt: 'desc' },
            take: 50
        });
        return {
            contents: [{
                uri: uri.href,
                text: JSON.stringify(expenses, null, 2)
            }]
        };
    }
);

// --- Tools ---

// Tool: Create a budget request
server.tool(
    "create_budget_request",
    "Create a new budget request",
    {
        project: z.string().describe("Project name"),
        categoryId: z.string().describe("Category ID"),
        amount: z.number().describe("Total amount requested"),
        requester: z.string().describe("Name of the requester"),
        reason: z.string().optional().describe("Reason for the request"),
        date: z.string().optional().describe("Date of request (YYYY-MM-DD). Defaults to today."),
        subActivityId: z.string().optional().describe("Sub-activity ID if applicable")
    },
    async ({ project, categoryId, amount, requester, reason, date, subActivityId }) => {
        try {
            const request = await prisma.budgetRequest.create({
                data: {
                    project,
                    category: categoryId, // Note: Schema uses 'category' as string ID
                    amount,
                    requester,
                    reason,
                    date: date || new Date().toISOString().split('T')[0],
                    status: 'pending',
                    subActivityId
                }
            });
            return {
                content: [{ type: "text", text: `Budget request created successfully. ID: ${request.id}` }]
            };
        } catch (error: any) {
            return {
                isError: true,
                content: [{ type: "text", text: `Failed to create budget request: ${error.message}` }]
            };
        }
    }
);

// Tool: Approve a budget request
server.tool(
    "approve_budget_request",
    "Approve a pending budget request",
    {
        id: z.string().describe("Budget Request ID"),
        approverId: z.string().describe("ID of the approver (User ID)")
    },
    async ({ id, approverId }) => {
        try {
            const request = await prisma.budgetRequest.findUnique({ where: { id } });
            if (!request) {
                return { isError: true, content: [{ type: "text", text: "Request not found" }] };
            }

            if (request.status !== 'pending') {
                return { isError: true, content: [{ type: "text", text: `Request is already ${request.status}` }] };
            }

            await prisma.budgetRequest.update({
                where: { id },
                data: {
                    status: 'approved',
                    approverId,
                    approvedAt: new Date()
                }
            });

            // Update category usage if applicable (simplified logic, assumes logic exists elsewhere or handles manually)
            // Note: In a real app, we should use a service function to handle creating the log and updating the category used amount.
            // For this MCP tool, we will just update the status for now to avoid duplicating complex business logic not imported here.
            // Ideally, creating a service layer would be better.

            // Let's try to update the used amount on the category as well to keep data consistent
            const category = await prisma.category.findUnique({ where: { id: request.category } });
            if (category) {
                await prisma.category.update({
                    where: { id: request.category },
                    data: { used: { increment: request.amount } }
                });

                await prisma.budgetLog.create({
                    data: {
                        categoryId: request.category,
                        amount: request.amount,
                        type: 'approve_request',
                        reason: `Approved request for ${request.project}`,
                        user: approverId
                    }
                });
            }


            return {
                content: [{ type: "text", text: `Budget request ${id} approved successfully.` }]
            };
        } catch (error: any) {
            return {
                isError: true,
                content: [{ type: "text", text: `Failed to approve budget request: ${error.message}` }]
            };
        }
    }
);

// Tool: Reject a budget request
server.tool(
    "reject_budget_request",
    "Reject a pending budget request",
    {
        id: z.string().describe("Budget Request ID"),
        rejectionReason: z.string().describe("Reason for rejection")
    },
    async ({ id, rejectionReason }) => {
        try {
            const request = await prisma.budgetRequest.findUnique({ where: { id } });
            if (!request) {
                return { isError: true, content: [{ type: "text", text: "Request not found" }] };
            }

            if (request.status !== 'pending') {
                return { isError: true, content: [{ type: "text", text: `Request is already ${request.status}` }] };
            }

            await prisma.budgetRequest.update({
                where: { id },
                data: {
                    status: 'rejected',
                    rejectionReason
                }
            });
            return {
                content: [{ type: "text", text: `Budget request ${id} rejected.` }]
            };
        } catch (error: any) {
            return {
                isError: true,
                content: [{ type: "text", text: `Failed to reject budget request: ${error.message}` }]
            };
        }
    }
);


// Start the server (Stdio)
export async function startMcpServer() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Budget Manager MCP Server running on stdio");
}

// Only run if called directly (script usage)
import { fileURLToPath } from 'url';
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    startMcpServer().catch((error) => {
        console.error("Fatal error in startMcpServer():", error);
        process.exit(1);
    });
}

export { server };
