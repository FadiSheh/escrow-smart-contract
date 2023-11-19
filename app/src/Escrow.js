export default function Escrow ({
  address,
  arbiter,
  beneficiary,
  value,
  handleApprove
}) {
  return (
    <div className='existing-contract'>
      <ul className='fields'>
        <li>
          <div> CONTRACT ADDRESS: </div>
          <div> {address} </div>
        </li>
        <li>
          <div> ARBITER: </div>
          <div> {arbiter} </div>
        </li>
        <li>
          <div> BENEFICIARY: </div>
          <div> {beneficiary} </div>
        </li>
        <li>
          <div> VALUE: </div>
          <div> {value} </div>
        </li>
        <div
          className='button'
          id={address}
          onClick={e => {
            e.preventDefault()

            handleApprove()
          }}
        >
          APPROVE
        </div>
      </ul>
    </div>
  )
}
