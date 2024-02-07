export const networkList = [
  {
    chainId: '0x13881',
    chainName: 'Mumbai',
    rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
    currencySymbol: 'MATIC',
    currencyDecimal: 18,
    tokenList: [
      {
        isNative: true,
        contractAddress: '0x0000000000000000000000000000000000000000',
        decimal: 18,
        symbol: 'MATIC',
        name: 'Matic'
      },
      {
        contractAddress: '0xC666283f0A53C46141f509ed9241129622013d95',
        decimal: 6,
        symbol: 'TEST',
        name: 'Test'
      }
    ]
  }
]
