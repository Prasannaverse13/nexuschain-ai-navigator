# **App Name**: NexusChain AI Navigator

## Core Features:

- Demand Prediction: Demand Forecasting: The Demand Forecasting Agent uses historical data from BigQuery and external factors to predict future demand. This information is shared with other agents. It uses the ADK.
- Realtime anomaly watch: Anomaly Detection: Continuously monitors data streams using AI, potentially Gemini 2.0 Flash via API (https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBxdNfAxjzBsqS_lrCiux3XvrNB6K86dvc) .  Flags anomalies and alerts relevant agents. Uses the ADK.
- Intelligent output: Action-Oriented Insights: Presents a concise summary of the agents' work, including key insights and recommendations, responding to the user query.
- Main dashboard: Dynamic Dashboard: A single-page dashboard that serves as the central hub for interacting with the NexusChain AI system.
- smart procurement: Procurement suggestion tool:  Monitors raw material prices and stock levels. Based on demand forecasts and inventory thresholds, it suggests optimal orders for raw materials using ADK. It monitors for anomalies. 
- track Agent work: Agent Activity Log: Displays a timestamped list of involved agents and their actions to provide transparency, expanding the summarization of an intelligent output. 

## Style Guidelines:

- Primary color: Google-esque Blue (#4285F4) to evoke trust and intelligence.
- Background color: Light gray (#F5F5F5), almost white, for a clean and spacious feel.
- Accent color: A vibrant green (#34A853) to indicate success and optimization.
- Body and headline font: 'Inter' (sans-serif) for a modern, neutral, readable style.
- Use minimalist, geometric icons to represent different agents and data points.
- Single-page layout with a prominent search bar at the top or center.
- Subtle 'thinking' indicator (dots, pulsating line) when a query is submitted to signal processing.