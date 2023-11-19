import { ethers } from 'ethers'
import { useEffect, useState } from 'react'

import deploy from './deploy'
import Escrow from './Escrow'

const provider = new ethers.providers.Web3Provider(window.ethereum)

export async function approve (escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve()
  await approveTxn.wait()
}

function App () {
  const [escrows, setEscrows] = useState([])
  const [account, setAccount] = useState()
  const [signer, setSigner] = useState()
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    async function getAccounts () {
      const accounts = await provider.send('eth_requestAccounts', [])
      setAccount(accounts[0])
      setSigner(provider.getSigner())
    }

    getAccounts()
  }, [account])

  const handleNext = () => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % escrows.length)
  }

  const handlePrev = () => {
    setCurrentIndex(
      prevIndex => (prevIndex - 1 + escrows.length) % escrows.length
    )
  }

  async function newContract () {
    const beneficiary = document.getElementById('beneficiary').value
    const arbiter = document.getElementById('arbiter').value
    const value = ethers.utils.parseEther(document.getElementById('wei').value)
    const escrowContract = await deploy(signer, arbiter, beneficiary, value)

    const escrow = {
      from: signer,
      address: escrowContract.address,
      arbiter,
      beneficiary,
      value: value.toString(),
      handleApprove: async () => {
        escrowContract.on('Approved', async () => {
          document.getElementById(escrowContract.address).className = 'complete'
          document.getElementById(escrowContract.address).innerText =
            "✓ It's been approved!"
        })

        await approve(escrowContract, signer)
      }
    }

    setEscrows([...escrows, escrow])
  }

  return (
    <>
      <div className='contract'>
        <h1> NEW CONTRACT </h1>
        <label>
          Arbiter Address
          <input type='text' id='arbiter' />
        </label>

        <label>
          Beneficiary Address
          <input type='text' id='beneficiary' />
        </label>

        <label>
          Deposit Amount (in ETH)
          <input type='text' id='wei' />
        </label>

        <div
          className='button'
          id='deploy'
          onClick={e => {
            e.preventDefault()

            newContract()
          }}
        >
          Deploy
        </div>
      </div>

      {escrows.length > 0 && (
        <div className='existing-contracts'>
          <div className='contracts-header'>
            {escrows.length > 1 && (
              <>
                <button className='nav-button' onClick={handlePrev}>
                  &lt; Prev
                </button>{' '}
              </>
            )}
            <h1> EXISTING CONTRACTS </h1>
            {escrows.length > 1 && (
              <>
                <button className='nav-button' onClick={handleNext}>
                  Next &gt;
                </button>{' '}
              </>
            )}
          </div>
          <div id='container' className='container-contracts'>
            <Escrow
              key={escrows[currentIndex].address}
              {...escrows[currentIndex]}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default App
