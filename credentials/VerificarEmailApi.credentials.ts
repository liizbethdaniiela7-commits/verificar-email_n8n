import {
	IAuthenticateGeneric,
	Icon,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class VerificarEmailApi implements ICredentialType {
	name = 'VerificarEmailApi';
	displayName = 'Verificar Email API';
	icon: Icon = 'file:email.svg';
	// Uses the link to this tutorial as an example
	// Replace with your own docs links when building your own nodes
	documentationUrl = 'https://docs.n8n.io/integrations/creating-nodes/build/declarative-style-node/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
            typeOptions: {
                password: true,
            },
			type: 'string',
			default: '',
		},
	];
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			qs: {
				'api_key': '={{$credentials.apiKey}}'
			}
		},
	};
}