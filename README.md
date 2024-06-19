# Pulumi DigitalOcean Deployment

This project demonstrates using Pulumi to deploy DigitalOcean resources, including VPC, Virtual Machine (Droplets) and a Security Group (Firewall).

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js and npm](https://nodejs.org/) (for installing Pulumi and dependencies)
- [Pulumi CLI](https://www.pulumi.com/docs/get-started/install/)
- [DigitalOcean account](https://www.digitalocean.com/)

## Setup

1. **Clone this repository**

You know how :D

2. **Install Dependencies:**

```bash
npm install
```

3. **Configure Pulumi Stack:**

Set up your Pulumi stack configuration to specify the DigitalOcean API token and other required configurations.

```bash
pulumi config --secret set digitalocean:token <your_digitalocean_api_token>
pulumi config --secret set config:sshFingerprint <your_ssh_key_fingerprint>
```

Replace your_digitalocean_api_token with your DigitalOcean API token and your_ssh_key_fingerprint with your SSH key fingerprint.

4. **Deploy Infrastructure:**

Deploy the Pulumi stack to create DigitalOcean resources:

```bash
pulumi up
```

Follow the prompts to confirm the deployment.

5. **Accessing Droplets:**

Once deployed, you can access the Droplets via SSH using their public IP addresses:

```bash
ssh username@droplet_public_ip
```

6. **Cleanup:**

To destroy the created resources and delete the stack:

```bash
pulumi destroy
```