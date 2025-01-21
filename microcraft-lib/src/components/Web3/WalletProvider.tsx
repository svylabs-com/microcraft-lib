// import React, { ReactNode } from 'react'
// import '@rainbow-me/rainbowkit/styles.css'  // Import RainbowKit styles
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { createPublicClient, http } from 'viem'
// import { WagmiConfig, createConfig } from 'wagmi'
// import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit'
// import { mainnet, sepolia } from 'wagmi/chains'
// import { publicProvider } from 'wagmi/providers/public'

// // Create the TanStack Query client
// const queryClient = new QueryClient()

// // Setup the chains and the public client using Viem
// const { chains, publicClient } = configureChains(
//   [mainnet, sepolia],
//   [publicProvider(), publicProvider()]
// )

// // Configure Wagmi
// const config = createConfig({
//   autoConnect: true,
//   publicClient,
// })

// // Setup RainbowKit with default wallets
// const { wallets } = getDefaultWallets({
//   appName: 'Microcraft',
//   projectId: 'YOUR_PROJECT_ID',
//   chains,
// })
// const connectors = connectorsForWallets([...wallets])

// // Configure RainbowKit
// const App: React.FC = () => {
//   return (
//     <WagmiConfig config={config}>
//       <QueryClientProvider client={queryClient}>
//         <RainbowKitProvider chains={chains}>
//           {/* Your App Components */}
//         </RainbowKitProvider>
//       </QueryClientProvider>
//     </WagmiConfig>
//   )
// }

// export default App
