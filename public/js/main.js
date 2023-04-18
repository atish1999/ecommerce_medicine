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