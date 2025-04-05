/** @odoo-module **/

import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
import { Component, useState, onWillStart } from "@odoo/owl";

export class VoiceAgentButton extends Component {
    setup() {
        this.state = useState({
            isRecording: false,
            isProcessing: false,
            showChat: false,
            messages: [],
            currentInput: "",
            voiceTimeout: null,
        });
        
        this.rpc = useService("rpc");
        this.notification = useService("notification");
        this.voiceAgentService = useService("voice_agent");
        
        onWillStart(async () => {
            this.hasSpeechRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
            
            if (!this.hasSpeechRecognition) {
                console.warn("Speech recognition is not supported in this browser");
            }
        });
    }
    
    /**
     * Toggle the microphone on/off
     */
    toggleMicrophone() {
        if (this.state.isRecording) {
            this.stopRecording();
        } else {
            this.startRecording();
        }
    }
    
    /**
     * Start recording audio
     */
    startRecording() {
        if (!this.hasSpeechRecognition) {
            this.notification.add(
                "Speech recognition is not supported in this browser",
                { type: "warning" }
            );
            return;
        }
        
        this.state.showChat = true;
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        
        this.recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('');
                
            this.state.currentInput = transcript;
            
            if (this.state.voiceTimeout) {
                clearTimeout(this.state.voiceTimeout);
            }
            
            this.state.voiceTimeout = setTimeout(() => {
                this.processVoiceInput(transcript);
            }, 1000);
        };
        
        this.recognition.onend = () => {
            if (this.state.isRecording) {
                this.state.isRecording = false;
            }
        };
        
        this.recognition.start();
        this.state.isRecording = true;
    }
    
    /**
     * Stop recording audio
     */
    stopRecording() {
        if (this.recognition) {
            this.recognition.stop();
            this.state.isRecording = false;
        }
    }
    
    /**
     * Process voice input
     * 
     * @param {string} transcript - The transcribed text from voice input
     */
    async processVoiceInput(transcript) {
        if (!transcript.trim()) {
            return;
        }
        
        this.addMessage("user", transcript);
        
        this.state.currentInput = "";
        
        this.state.isProcessing = true;
        try {
            const result = await this.rpc("/voice_agent/process_voice", {
                text_input: transcript,
            });
            
            if (result.error) {
                this.notification.add(result.error, { type: "danger" });
                this.addMessage("system", `Error: ${result.error}`);
            } else {
                this.addMessage("assistant", result.prompt);
                
                if (result.js_code) {
                    try {
                        this.voiceAgentService.executeCode(result.js_code);
                    } catch (error) {
                        console.error("Error executing code:", error);
                        this.notification.add(
                            "Error executing action",
                            { type: "danger" }
                        );
                    }
                }
            }
        } catch (error) {
            console.error("Error processing voice input:", error);
            this.notification.add(
                "Error processing voice input",
                { type: "danger" }
            );
        } finally {
            this.state.isProcessing = false;
        }
    }
    
    /**
     * Add a message to the chat
     * 
     * @param {string} type - The type of message (user, assistant, system)
     * @param {string} content - The message content
     */
    addMessage(type, content) {
        this.state.messages.push({
            id: Date.now(),
            type,
            content,
            timestamp: new Date(),
        });
    }
    
    /**
     * Handle text input submission
     * 
     * @param {Event} event - The form submit event
     */
    onSubmit(event) {
        event.preventDefault();
        const input = this.state.currentInput.trim();
        if (input) {
            this.processVoiceInput(input);
        }
    }
    
    /**
     * Update the current input value
     * 
     * @param {Event} event - The input change event
     */
    onInputChange(event) {
        this.state.currentInput = event.target.value;
    }
    
    /**
     * Toggle the chat window visibility
     */
    toggleChat() {
        this.state.showChat = !this.state.showChat;
    }
    
    /**
     * Close the chat window
     */
    closeChat() {
        this.state.showChat = false;
        this.stopRecording();
    }
}

VoiceAgentButton.template = "goshawk_odoo_voice_agent.VoiceAgentButton";

const systrayRegistry = registry.category("systray");
systrayRegistry.add("voice_agent_button", {
    Component: VoiceAgentButton,
    isDisplayed: () => true,
}, { sequence: 5 }); // Position it near the beginning of the systray
