let sbtn=document.querySelector('.submitMedicine');

function showSpinner(){
    document.querySelector('.spinner').classList.add('show');
}

function removeSpinner(){
    document.querySelector('.spinner').classList.remove('show');
}

async function getMedicine(medicineName){
    try {
        showSpinner();
        let response=await fetch('/user/searchMedicine',{
            method:'POST',
            headers:{
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                medicineName
            }),
        })
    
        if(!response.ok){
            removeSpinner();
            throw new Error('Medicine Could Not be found');
        }

        const data=await response.json();
        console.log(data);
        removeSpinner();
        if(data.error)
            throw new Error(data.error);
        
    } catch (error) {
        document.querySelector('.msg').textContent=error;
    }
   
}

sbtn.addEventListener('click',(e)=>{
    e.preventDefault();
    document.querySelector('.msg').textContent="";
    let medicineName=document.querySelector('.searchMedicine').value;
    if(medicineName===""){
        alert("Inset a Medicine Name");
        return;
    }
    getMedicine(medicineName);
    medicineName="";
})