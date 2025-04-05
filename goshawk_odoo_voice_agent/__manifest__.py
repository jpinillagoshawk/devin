{
    'name': 'Goshawk Odoo Voice Agent',
    'version': '1.0',
    'category': 'Productivity/Voice',
    'summary': 'Control Odoo with voice commands',
    'description': """
Goshawk Odoo Voice Agent
========================
This module adds voice control capabilities to Odoo 17, enabling users to interact with the system using natural language commands.

Features:
- Voice recognition for Odoo 17 interface
- Microphone button integration in the Odoo UI
- Chat interface supporting both text and voice input
- Voice command processing through Google Gemini LLM
- Conversion of natural language to Odoo actions
    """,
    'author': 'Goshawk',
    'website': 'https://www.goshawk.com',
    'depends': [
        'base',
        'web',
        'mail',
    ],
    'data': [
        'security/ir.model.access.csv',
        'views/voice_agent_views.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'goshawk_odoo_voice_agent/static/src/js/voice_agent_button.js',
            'goshawk_odoo_voice_agent/static/src/js/voice_agent_service.js',
            'goshawk_odoo_voice_agent/static/src/js/voice_agent_style.scss',
            'goshawk_odoo_voice_agent/static/src/xml/voice_agent_button.xml',
        ],
    },
    'installable': True,
    'application': False,
    'auto_install': False,
    'license': 'LGPL-3',
}
