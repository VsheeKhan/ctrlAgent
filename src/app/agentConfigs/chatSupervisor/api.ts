import { CTRL_BASE, CTRL_EMAIL, CTRL_PASSWORD, ACCOUNT_ID, AGENT_ID } from './config';

export async function loginCtrlAgent(): Promise<string> {
    const response = await fetch(`${CTRL_BASE}/ctrlagent/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: CTRL_EMAIL,
            password: CTRL_PASSWORD
        })
    });

    if (!response.ok) {
        throw new Error(`Login failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.access_token;
}

export async function newConversation(token: string): Promise<string> {
    const response = await fetch(`${CTRL_BASE}/api/v1/conversation/new`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            account_id: ACCOUNT_ID,
            agent_id: AGENT_ID,
            initial_variables: {}
        })
    });

    if (!response.ok) {
        throw new Error(`Failed to create conversation: ${response.statusText}`);
    }

    const data = await response.json();
    return data.conversation_id || data.conversationId || data.id;
}

export function getWsUrl(token: string, convId: string): string {
    const wsBase = CTRL_BASE.replace('http://', 'ws://');
    return `${wsBase}/api/v1/ws/conversation/${convId}?token=${token}&channel=voice`;
}
