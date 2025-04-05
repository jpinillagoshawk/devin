# goshawk_odoo_voice_agent

A voice-controlled agent for Odoo 17 that allows users to perform actions using voice commands.

## Project Overview

This module adds voice control capabilities to Odoo 17, enabling users to interact with the system using natural language commands. The module integrates a microphone button next to Odoo's developer button, which opens a chat interface that accepts both text and voice input.

### Key Features

- Voice recognition for Odoo 17 interface
- Microphone button integration in the Odoo UI
- Chat interface supporting both text and voice input
- Voice command processing through Google Gemini LLM
- Conversion of natural language to Odoo actions
- Initial command set: "open inventory", "open settings", "activate debug mode", "open main menu"

## Technical Architecture

### Components

1. **Frontend Components**
   - Microphone button next to the developer button
   - Integration with Odoo's existing chat window
   - Voice input detection and processing

2. **Backend Services**
   - Server-side voice recognition
   - LLM integration for command processing
   - Action execution engine

### Workflow

1. User clicks the microphone button or types in the chat
2. For voice input:
   - Voice is captured and sent to the server
   - Server processes voice to text
   - Text is automatically entered in the chat after 1 second
3. Input text is sent to Google Gemini LLM to generate a prompt
4. The prompt is processed by a second LLM instance to convert it to Odoo actions
5. JavaScript code is generated and executed to perform the requested action

## Implementation Plan

### Phase 1: Basic Infrastructure
- Set up the module structure
- Implement the microphone button UI
- Integrate with Odoo's chat window
- Implement basic server-side voice recognition

### Phase 2: LLM Integration
- Connect to Google Gemini API
- Implement prompt generation
- Develop action conversion logic

### Phase 3: Action Execution
- Implement JavaScript execution engine
- Create handlers for initial command set
- Test and refine the system

### Phase 4: Future Enhancements
- Implement multi-step task execution
- Upgrade to nvidia's canary-1b-flash for voice recognition
- Expand the command set
- Add user customization options

## Initial Command Set

- "open inventory" - Opens the inventory application
- "open settings" - Opens the settings menu
- "activate debug mode" - Activates Odoo's debug mode
- "open main menu" - Opens the main menu (clicks the o_menu_toggle class button)

## Development Notes

- Voice recognition will initially use a basic Python library
- Future versions will migrate to nvidia's canary-1b-flash
- The module will reuse Odoo's existing chat window UI
- OWL syntax reference from Odoo Enterprise 17 will be used for frontend development

## Installation

[Installation instructions will be added here]

## Usage

[Usage instructions will be added here]

## Contributing

[Contribution guidelines will be added here]

## License

[License information will be added here]
