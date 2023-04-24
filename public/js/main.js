function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}


let btn=document.querySelector('.addcomp');
btn.addEventListener('click',(e)=>{
    e.preventDefault();
    let parent=document.querySelector('.comp');
    let newNode=document.createElement('input');
    newNode.type='text';
    newNode.name="composition";
    newNode.placeholder="Enter Composition Name";
    parent.appendChild(newNode);
})