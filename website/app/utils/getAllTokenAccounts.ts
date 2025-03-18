import { Connection, PublicKey } from '@solana/web3.js';

const RPC_URL = 'https://solana-devnet.g.alchemy.com/v2/AlZpXuvewHz3Ty-rYFKn1Oc1kuMtDk8e';
const connection = new Connection(RPC_URL);

// Metaplex Token Metadata Program ID
const METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");

const getMetadataPDA = async (mint: PublicKey) => {
    return (
        await PublicKey.findProgramAddress(
            [Buffer.from("metadata"), METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
            METADATA_PROGRAM_ID
        )
    )[0];
};

export const getTokensWithMetadata = async (walletAddress: PublicKey) => {
    try {
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(walletAddress, {
            programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
        });

        const tokens = tokenAccounts.value.map((account) => {
            const tokenData = account.account.data.parsed.info;
            return {
                mint: new PublicKey(tokenData.mint),
                amount: tokenData.tokenAmount.uiAmount,
                decimals: tokenData.tokenAmount.decimals,
            };
        });

        const tokensWithMetadata = await Promise.all(tokens.map(async (token) => {
            try {
                const metadataPDA = await getMetadataPDA(token.mint);
                const metadataAccount = await connection.getAccountInfo(metadataPDA);

                if (metadataAccount) {
                    const metadata = metadataAccount.data.toString("utf8");
                    const uriStart = metadata.indexOf("https");
                    const uriEnd = metadata.indexOf("\x00", uriStart);
                    const metadataUri = metadata.substring(uriStart, uriEnd);

                    const metadataJson = await fetch(metadataUri).then(res => res.json());

                    return {
                        ...token,
                        name: metadataJson.name || "Unknown",
                        symbol: metadataJson.symbol || "Unknown",
                        image: metadataJson.image || "",
                    };
                }
            } catch (error) {
                console.error(`Error fetching metadata for token: ${token.mint.toBase58()}`, error);
            }

            return { ...token, name: "Unknown", symbol: "Unknown", image: "" };
        }));

        return tokensWithMetadata;
    } catch (error) {
        console.error("Error fetching tokens:", error);
    }
};