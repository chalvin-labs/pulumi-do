import * as pulumi from '@pulumi/pulumi'
import * as digitalocean from '@pulumi/digitalocean'

const config = new pulumi.Config('config')
const sshKeyFingerprint = config.requireSecret('sshFingerprint')
const stack = pulumi.getStack()

// Create a DigitalOcean VPC
const vpc = new digitalocean.Vpc('k8s-vpc', {
	name: 'k8s-vpc',
	region: 'sgp1',
	ipRange: '10.0.0.0/16',
})

// Create three Droplets
const dropletNames = ['master', 'worker-01', 'worker-02']
const droplets = dropletNames.map(
	(name) =>
		new digitalocean.Droplet(name, {
			name: name,
			region: vpc.region,
			size: 's-2vcpu-2gb',
			image: 'ubuntu-24-04-x64',
			vpcUuid: vpc.id,
			monitoring: true,
			sshKeys: [sshKeyFingerprint],
			tags: ['kubernetes', name === 'master' ? 'master' : 'worker'],
		})
)

const portRanges = [
	'22',
	'80',
	'443',
	'6443',
	'6783',
	'8080',
	'2379-2380',
	'10248-10260',
	'30000-32767',
]

const securityGroup = new digitalocean.Firewall('kubernetes-sg', {
	name: 'kubernetes-sg',

	inboundRules: [
		...portRanges.map((portRange) => ({
			protocol: 'tcp',
			portRange: portRange,
			sourceAddresses: ['0.0.0.0/0', '::/0'],
		})),
		{
			protocol: 'udp',
			portRange: '6784',
			sourceAddresses: ['0.0.0.0/0', '::/0'],
		},
		{
			protocol: 'icmp',
			sourceAddresses: ['0.0.0.0/0', '::/0'],
		},
	],

	outboundRules: [
		{
			protocol: 'tcp',
			portRange: 'all',
			destinationAddresses: ['0.0.0.0/0', '::/0'],
		},
	],

	dropletIds: pulumi
		.all(droplets.map((droplet) => droplet.id))
		.apply((ids) => ids.map((id) => parseInt(id))),
})

// const dropletNames = [
//   {
//     name: 'playground',
//     size: 's-1vcpu-1gb',
//   },
//   {
//     name: 'playground-02',
//     size: 's-1vcpu-1gb',
//   },
// ]
// const droplets = dropletNames.map(
//   (droplet) =>
//     new digitalocean.Droplet(droplet.name, {
//       name: droplet.name,
//       region: vpc.region,
//       size: droplet.size,
//       image: 'ubuntu-24-04-x64',
//       vpcUuid: vpc.id,
//       monitoring: true,
//       sshKeys: [sshKeyFingerprint],
//     })
// )

// Export the Droplet IPs
// pulumi stack output dropletIps --json > output.json
export const dropletIps = droplets.map((droplet) => ({
	name: droplet.name,
	ip: droplet.ipv4Address,
}))
