
# NexusChain AI Navigator

NexusChain AI Navigator is an advanced, multi-agent AI system designed to analyze and provide comprehensive insights into complex supply chain queries. It serves as a "Unified Supply Chain Brain," orchestrating specialized AI agents to break down a high-level goal, gather information, and synthesize a holistic report.

This project is built using **Next.js**, **React**, and **Tailwind CSS** for the frontend, with a powerful backend powered by Google's **Genkit** and AI models.

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

## Google Cloud Project

This application is configured to integrate with the following Google Cloud project:

-   **Project Name**: My First Project
-   **Project ID**: `active-tangent-463604-p9`
-   **Project Number**: `639287041239`

## How NexusChain AI Works

The application follows a sophisticated orchestration pattern:

1.  **User Query**: The user enters a high-level supply chain goal (e.g., "Analyze the sourcing challenges for lithium batteries").
2.  **Manager Agent Orchestration**: A central **Manager Agent** receives the query. It formulates a plan and determines which specialized sub-agents are needed to address the query.
3.  **Task Delegation**: The Manager Agent calls upon its team of specialist agents (e.g., Sourcing Agent, Manufacturing Agent) in a logical sequence, providing them with the specific tasks they need to perform.
4.  **Agent Execution**: Each specialist agent performs its analysis by generating simulated search queries and extracting key findings, mimicking real-world research.
5.  **Synthesis and Reporting**: The agents return their findings to the Manager Agent. The Manager Agent then synthesizes all the collected information into a single, structured, and comprehensive report for the user.
6.  **Display & Download**: The final report is displayed in the UI, and the user has the option to download it as a PDF.

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

### Vertex AI & Google AI

The application uses Genkit's plugins to connect to Google's powerful AI models. The configuration is designed to be "Vertex AI ready" while ensuring stability for the demo by using the Google AI endpoint.

-   **File Location**: The Genkit configuration is in `src/ai/genkit.ts`.
-   **Implementation Details**:
    -   The `vertexAI` plugin is imported and configured, demonstrating the project's readiness to connect directly to a specific Google Cloud project's AI infrastructure.
    -   To ensure maximum reliability for the demo, the default model is set to `googleai/gemini-2.0-flash` using the `googleAI` plugin with the `v1beta` API, which has proven to be stable.

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
