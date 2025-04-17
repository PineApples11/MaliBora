import "./profile.css"
function Profile ({customer, handleShowProfile}) {
  
    return (
        <div className="profile-body">
             <div class="card-container">
                <img class="round" src="https://assets.codepen.io/285131/almeria-avatar.jpeg" alt="user" />
                <h3>{customer.full_name}</h3>
                <h6>Kshs {customer.savings_balance} </h6>
                <p>Phone: {customer.phone} </p>
                <p>Created at: {new Date(customer.created_at).toLocaleDateString()} <br/> National ID; {customer.national_id}</p>
                <div class="buttons">
                    <button class="primary" onClick={handleShowProfile}>
                        Dashboard
                    </button>
                </div>
                <div class="skills">
                    <ul>
                        <li>Loans: {customer.loans.length}</li>
                        <li>Repayments: {customer.repayments.length}</li>
                        <li>Transactions: {customer.savings_transactions.length}</li>
                    </ul>
                </div>
            </div>

            <footer>
                <p>
                    Created with <i class="fa fa-heart"></i> by
                    <a target="_blank" href="https://florin-pop.com">Florin Pop</a>
                    - Read how I created this
                    <a target="_blank" href="https://florin-pop.com/blog/2019/04/profile-card-design">here</a>
                    - Design made by
                    <a target="_blank" href="https://dribbble.com/shots/6276930-Profile-Card-UI-Design">Ildiesign</a>
                </p>
            </footer>
        </div>
    )
}
export default Profile