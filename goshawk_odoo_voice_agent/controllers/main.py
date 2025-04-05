
from odoo import http
from odoo.http import request
import json
import logging

_logger = logging.getLogger(__name__)

class VoiceAgentController(http.Controller):
    
    @http.route('/voice_agent/process_voice', type='json', auth='user')
    def process_voice(self, audio_data=None, text_input=None):
        """
        Process voice input or direct text input
        
        Args:
            audio_data: Base64 encoded audio data
            text_input: Direct text input (if voice recognition is done client-side)
            
        Returns:
            JSON response with action to execute
        """
        try:
            voice_agent = request.env['goshawk.voice.agent'].sudo().search([], limit=1)
            
            if not voice_agent:
                return {'error': 'Voice agent not configured'}
            
            if not text_input and not audio_data:
                return {'error': 'No input provided'}
            
            
            prompt = voice_agent.generate_prompt(text_input)
            
            js_code = voice_agent.execute_action(prompt)
            
            return {
                'success': True,
                'prompt': prompt,
                'js_code': js_code
            }
            
        except Exception as e:
            _logger.exception("Error processing voice input")
            return {'error': str(e)}
