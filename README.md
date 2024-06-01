# Retroactive POKT Goods Funding

POKT’s experimental first round of retroactive grants is open to projects & individuals for contributions that delivered impact to the POKT ecosystem.
[**Production Website**](https://impact.pokt.network/)

[<img src="./docs/images/main.png">](https://impact.pokt.network/)

## Documentation

- [Setup & Deployment](./docs/01_setup.md)
- [Adding Projects & Approving](./docs/02_adding_projects.md)
- [Voting](./docs/04_voting.md)
- [Results](./docs/06_results.md)

## Supported Networks

All networks EAS is deployed to are supported

- https://docs.attest.sh/docs/quick--start/contracts

#### Mainnets

- Ethereum
- Optimism
- Base
- Arbitrum One
- Linea

#### Testnets

- Sepolia
- Optimism Goerli
- Base Goerli
- Arbitrum Goerli
- Polygon Mumbai
- Linea Goerli

## Development

To run locally follow these instructions:

```sh
git clone https://github.com/gitcoinco/easy-retro-pgf

bun install # (or pnpm / yarn / npm)

cp .env.example .env # and update .env variables

bun run dev

bun run db:push # create database tables

open localhost:3000
```

### Technical details

- **EAS** - Projects, lists, profiles, etc are all stored on-chain in Ethereum Attestation Service
- **Batched requests with tRPC** - Multiple requests are batched into one (for example when the frontend requests the metadata for 24 projects they are batched into 1 request)
- **Server-side caching of requests to EAS and IPFS** - Immediately returns the data without calling EAS and locally serving ipfs cids.
- **SQL database for ballots** - Votes are stored privately in a Postgres database
  - Could votes be stored on EAS as well? It would need to happen server-side from an admin signer to keep voters anonymous.
