
import { execSync } from 'child_process';

function getServiceAccountJson(): string {
    try {
        const secretJson = execSync('firebase apphosting:secrets:get firebaseServiceAccountKey --json').toString();
        const secret = JSON.parse(secretJson);
        return secret.value.stringValue;
    } catch (error) {
        console.error("Failed to retrieve service account JSON. Make sure you are logged into the Firebase CLI and have the necessary permissions.");
        process.exit(1);
    }
}

process.stdout.write(getServiceAccountJson());
