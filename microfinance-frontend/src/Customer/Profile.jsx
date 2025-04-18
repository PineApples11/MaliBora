import Footer from "./Footer"
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

            <Footer />
        </div>
    )
}
export default Profile