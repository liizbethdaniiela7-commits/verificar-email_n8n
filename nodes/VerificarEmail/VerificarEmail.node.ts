import type {
    IDataObject,
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
} from 'n8n-workflow';

import { NodeConnectionTypes } from 'n8n-workflow';

export class VerificarEmail implements INodeType {
    description: INodeTypeDescription = {
        // Basic node details will go here
        displayName: 'Verificar Email',
        name: 'verificarEmail',
        icon: 'file:email.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Verify email addresses',
        defaults: {
            name: 'Verificar Email',
        },
        usableAsTool: true,
        inputs: [NodeConnectionTypes.Main],
        outputs: [NodeConnectionTypes.Main],
        credentials: [
            {
                name: 'VerificarEmailApi',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Direccion De Email',
                name: 'email',
                type: 'string',
                placeholder: 'test@domain.com',
                default: '',
            },
            // Operations will go here
        ]
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items: INodeExecutionData[] = this.getInputData();
        const returnData: Array<{ json: IDataObject }> = [];

        for (let i: number = 0; i < items.length; i++) {
            const email = this.getNodeParameter('email', i) as string;
            const credentials = await this.getCredentials('VerificarEmailApi');
            const apiKey = credentials?.apiKey;

            const response = await this.helpers.httpRequest({
                method: 'GET',
                url: 'https://api.emailable.com/v1/verify',
                qs: {
                    email,
                    api_key: apiKey,
                },
                headers: {
                    Accept: 'application/json',
                },
                json: true
            });
            const results = Array.isArray(response) ? response : [response];
            for (const result of results) {
                returnData.push({
                    json: {
                        email: result.email,
                        score: result.score
                    }
                })
            }
        }
        return this.prepareOutputData(returnData);
    }
}