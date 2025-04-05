/** @odoo-module **/

import { registry } from "@web/core/registry";
import { browser } from "@web/core/browser/browser";

/**
 * Voice Agent Service
 * 
 * Provides functionality for executing voice commands in Odoo
 */
export const voiceAgentService = {
    dependencies: ["rpc", "notification"],
    
    start(env, { rpc, notification }) {
        return {
            /**
             * Execute JavaScript code generated from voice commands
             * 
             * @param {string} code - JavaScript code to execute
             * @returns {any} - Result of the execution
             */
            executeCode(code) {
                try {
                    const wrappedCode = `
                        (function() {
                            "use strict";
                            ${code}
                        })();
                    `;
                    
                    return (new Function(wrappedCode))();
                } catch (error) {
                    console.error("Error executing voice command code:", error);
                    notification.add(
                        "Error executing voice command",
                        { type: "danger" }
                    );
                    throw error;
                }
            },
            
            /**
             * Predefined actions for common voice commands
             */
            actions: {
                /**
                 * Open the main menu
                 */
                openMainMenu() {
                    const menuToggle = document.querySelector(".o_menu_toggle");
                    if (menuToggle) {
                        menuToggle.click();
                    } else {
                        notification.add(
                            "Main menu toggle button not found",
                            { type: "warning" }
                        );
                    }
                },
                
                /**
                 * Activate debug mode
                 */
                activateDebugMode() {
                    const url = new URL(browser.location.href);
                    if (!url.searchParams.has("debug")) {
                        url.searchParams.set("debug", "1");
                        browser.location.href = url.toString();
                    } else {
                        notification.add(
                            "Debug mode is already active",
                            { type: "info" }
                        );
                    }
                },
                
                /**
                 * Open a specific app by name
                 * 
                 * @param {string} appName - The name of the app to open
                 */
                openApp(appName) {
                    const appLinks = Array.from(document.querySelectorAll(".o_app, .dropdown-item"));
                    const app = appLinks.find(el => 
                        el.textContent.trim().toLowerCase() === appName.toLowerCase()
                    );
                    
                    if (app) {
                        app.click();
                    } else {
                        const appsButton = document.querySelector(".o_navbar_apps_menu button");
                        if (appsButton) {
                            appsButton.click();
                            setTimeout(() => {
                                const appInMenu = Array.from(document.querySelectorAll(".dropdown-item"))
                                    .find(el => el.textContent.trim().toLowerCase() === appName.toLowerCase());
                                
                                if (appInMenu) {
                                    appInMenu.click();
                                } else {
                                    notification.add(
                                        `App "${appName}" not found`,
                                        { type: "warning" }
                                    );
                                }
                            }, 300);
                        } else {
                            notification.add(
                                `App "${appName}" not found`,
                                { type: "warning" }
                            );
                        }
                    }
                },
                
                /**
                 * Open settings
                 */
                openSettings() {
                    this.openApp("Settings");
                }
            }
        };
    }
};

registry.category("services").add("voice_agent", voiceAgentService);
