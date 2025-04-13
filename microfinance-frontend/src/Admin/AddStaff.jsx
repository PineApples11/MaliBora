import React, {useState,useEffect} from 'react';


function StaffForm(){
 const [id,setId]=useState("");
 const [full_name,setFull_name]=useState("");
 const [email,setEmail]=useState("");
 const [password,setPassword]=useState("");
 const [date,setDate]=useState("");

 function handleSubmit(event){
  event.preventdefault();

  const newStaff = {
    id,
    full_name,
    email,
    password,
    date,
  };

  fetch("http://127.0.0.1:5555/newStaffs",{
    method: "POST",
    headers:{
      "Content-Type":"application/json",
    },
    body: JSON.stringify(newStaff),
  })
  .then((r) => r.json())
  .then((newEntry) => {
    onSubmit(newEntry); 
  });
  
  setId("");
  setFull_name("");
  setEmail("");
  setPassword("");
  setDate("");
 }

 return(
  <div className='staff-form'>
    <h1> Staff Form </h1>
    <form onSubmit = {handleSubmit}>
    <input type="text" placeholder="id" onChange={(e) => setId(e.target.value)} value={id} />
    <input type="text" placeholder="FullName" onChange={(e) => setFull_name(e.target.value)} value={full_name} />
    <input type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)} value={email} />
    <input type="text" placeholder="Password" onChange={(e) => setFirstName(e.target.value)} value={password} />
    <input type="text" placeholder="Date" onChange={(e) => setFirstName(e.target.value)} value={date} />
    

    </form>
  </div>
 )
}

export default StaffForm;