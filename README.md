
# NexusChain AI Navigator

NexusChain AI Navigator is an advanced, multi-agent AI system designed to analyze and provide comprehensive insights into complex supply chain queries. It serves as a "Unified Supply Chain Brain," orchestrating specialized AI agents to break down a high-level goal, gather information, and synthesize a holistic report.

This project is built using **Next.js**, **React**, and **Tailwind CSS** for the frontend, with a powerful backend powered by Google's **Genkit** and AI models.

We have also leveraged the **Agent Development Kit (ADK)** in this project to facilitate the creation and orchestration of our multi-agent system.

## How NexusChain AI Navigator Works

The application follows a sophisticated orchestration pattern powered by a multi-agent backend. Here's a breakdown of the end-to-end process, from user query to final report.

1.  **User Initiates Query**: The user enters a high-level supply chain goal into the frontend (e.g., "Analyze the sourcing challenges for lithium batteries").

2.  **Manager Agent Invocation**: The frontend calls the `mainQuery` flow located in `src/ai/flows/main-query-flow.ts`. This flow acts as the entry point to the **Manager Agent**, which is the central orchestrator of the system.

3.  **AI-Powered Planning & Tool Selection**: The Manager Agent is not just a simple script; it's a powerful AI prompt given a complex goal and a set of **tools**. Each specialist agent (Sourcing, Manufacturing, etc.) is defined as a tool that the Manager can choose to use. The Manager Agent analyzes the user's query and autonomously decides:
    *   **What is the plan?** It breaks down the high-level goal into smaller, logical steps.
    *   **Which agents are needed?** It determines which specialist agents (tools) are required to execute the plan.
    *   **In what order?** It calls the agents in a sequence that makes sense. For a query on "sourcing challenges," it would naturally call the `sourcingAgent` tool first.

4.  **Sequential Task Delegation & Execution**: The Manager Agent executes its plan by calling the selected agent tools one by one.
    *   The `sourcingAgent` is called to research suppliers and pricing.
    *   The `manufacturingAgent` is called to investigate production complexities.
    *   This continues for all relevant agents, each performing its focused analysis and returning its findings.

5.  **Synthesis and Final Report Generation**: As the specialist agents return their findings, the information is collected by the Manager Agent. Once its plan is complete, its final instruction is to synthesize all the gathered data into a single, structured report, adhering to a predefined JSON schema.

6.  **Display & Download**: The final report object is sent back to the frontend, where it's rendered in a user-friendly format. The user can then download this comprehensive report as a PDF for offline viewing and sharing.

## The Multi-Agent System (ADK Implementation)

This project is a full implementation of the agentic pattern described by the **Agent Development Kit (ADK)**. We use **Genkit** as the core framework to build and orchestrate this multi-agent system.

### Manager Agent (The Orchestrator)

The Manager Agent is the brain of the operation. It interprets the user's intent, delegates tasks to the appropriate specialist agents, and synthesizes their findings into the final report.

-   **File Location**: `src/ai/flows/main-query-flow.ts`

### Specialist Agents (The Team)

Each specialist agent is a Genkit tool with a specific area of expertise. They are designed to be modular and independent.

-   **File Location**: All specialist agents are located in the `src/ai/agents/` directory.
-   **Agents Include**:
    -   `planning-agent.ts`: Analyzes demand forecasting and market trends.
    -   `sourcing-agent.ts`: Researches suppliers and raw material pricing.
    -   `manufacturing-agent.ts`: Investigates production processes and quality control.
    -   `inventory-agent.ts`: Researches optimal stock levels and strategies.
    -   `delivery-agent.ts`: Analyzes logistics and transportation routes.
    -   `returns-agent.ts`: Investigates reverse logistics and return policies.
    -   `anomaly-detection-agent.ts`: Monitors data streams for unusual events like price spikes or delays.

## Google Cloud & AI Ecosystem Integration

The application is built to leverage the Google Cloud ecosystem for robust, scalable AI functionality.
The application is built to leverage the **Google Cloud AI** ecosystem for robust, scalable AI functionality.

### Vertex AI & Google AI

The application uses Genkit's plugins to connect to Google's powerful AI models. The configuration is designed to be "Vertex AI ready" while ensuring stability for the demo by using the Google AI endpoint.

-   **File Location**: The Genkit configuration is in `src/ai/genkit.ts`.
-   **Implementation Details**:
    -   The `vertexAI` plugin is imported and configured, demonstrating the project's readiness to connect directly to a specific Google Cloud project's AI infrastructure.
    -   To ensure maximum reliability for the demo, the default model is set to `googleai/gemini-2.0-flash` using the `googleAI` plugin with the `v1beta` API, which has proven to be stable.


## How to Run

1.  **Start the Next.js Frontend:**
    Run the development server on port 9002.
    ```bash
    npm run dev
    ```

2.  **Start the AI Backend (Genkit):**
    In a separate terminal, run the Genkit development server.
    ```bash
    npm run genkit:watch
    ```    

### BigQuery Integration

The application is architected to integrate with enterprise-level data stored in BigQuery, allowing it to move from open-internet simulation to highly precise, company-specific analysis.

-   **File Location**: `src/services/bigquery.ts`
-   **Implementation Details**:
    -   This service file contains a mock function (`getHistoricalSalesData`) that simulates fetching data from a BigQuery table. In a production environment, this file would contain the actual client logic to query live sales, inventory, or ERP data.

### Firebase App Hosting

The project is ready for deployment and scaling via Firebase App Hosting.

-   **File Location**: `apphosting.yaml`
-   **Implementation Details**:
    -   This configuration file contains the necessary settings for a production deployment on Firebase's managed infrastructure.
