
from odoo import models, fields, api
import base64
import os
from google import genai
from google.genai import types

class VoiceAgent(models.Model):
    _name = 'goshawk.voice.agent'
    _description = 'Voice Agent for Odoo'

    name = fields.Char(string='Name', required=True, default='Voice Agent')
    active = fields.Boolean(string='Active', default=True)
    api_key = fields.Char(string='API Key', help='Google Gemini API Key')
    
    def generate_prompt(self, text_input):
        """
        Generate a prompt from the user's text input using Google Gemini
        """
        api_key = self.api_key or os.environ.get("AIzaSyBNuuybMmcFjk6WZbzI5ZrrL7lp3HQKn0Y")
        client = genai.Client(api_key=api_key)
        
        model = "gemini-2.0-flash-lite"
        contents = [
            types.Content(
                role="user",
                parts=[
                    types.Part.from_text(text=f"""
                    You are an Odoo assistant that converts natural language commands into specific Odoo actions.
                    Convert the following user input into a structured command:
                    
                    {text_input}
                    
                    Respond with a JSON object containing:
                    - action: The type of action to perform (e.g., "open_app", "toggle_debug", "open_menu")
                    - target: The specific target for the action (e.g., app name, menu item)
                    - parameters: Any additional parameters needed
                    """),
                ],
            ),
        ]
        
        generate_content_config = types.GenerateContentConfig(
            response_mime_type="text/plain",
        )
        
        response = client.models.generate_content(
            model=model,
            contents=contents,
            config=generate_content_config,
        )
        
        return response.text
    
    def execute_action(self, prompt):
        """
        Convert a prompt into executable JavaScript code for Odoo actions
        """
        api_key = self.api_key or os.environ.get("AIzaSyBNuuybMmcFjk6WZbzI5ZrrL7lp3HQKn0Y")
        client = genai.Client(api_key=api_key)
        
        model = "gemini-2.0-flash-lite"
        contents = [
            types.Content(
                role="user",
                parts=[
                    types.Part.from_text(text=f"""
                    You are an Odoo JavaScript expert. Generate JavaScript code to execute the following action in Odoo 17:
                    
                    {prompt}
                    
                    For reference:
                    - To open an app: Use the app switcher or find the app in the menu
                    - To toggle debug mode: Use the debug menu in the user menu
                    - To open the main menu: Click the element with class "o_menu_toggle"
                    - To open settings: Navigate to the settings app
                    
                    Return only the JavaScript code without any explanation or markdown formatting.
                    """),
                ],
            ),
        ]
        
        generate_content_config = types.GenerateContentConfig(
            response_mime_type="text/plain",
        )
        
        response = client.models.generate_content(
            model=model,
            contents=contents,
            config=generate_content_config,
        )
        
        return response.text
