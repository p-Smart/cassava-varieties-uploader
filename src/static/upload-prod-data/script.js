const form = document.getElementById('uploadForm')
form.addEventListener('submit', async function(event) {
    const responseEl = document.getElementById('response')
    const responseLogsEl = document.getElementById('response-logs')
    const submitBtn = document.getElementById('submit')

    event.preventDefault();
    responseEl.textContent = ''
    responseLogsEl.innerHTML = ''
    responseLogsEl.style.display = 'none'

    const reqId = crypto.randomUUID();
    const formData = new FormData(form);
    formData.append('reqId', reqId)
    let bodyData = {
        username: form.querySelector(`[name="username"]`).value,
        password: form.querySelector(`[name="password"]`).value,
        data: '',
        reqId,
        mode: Array.from(form.querySelectorAll(`[name="mode"]`)).find( input => input.checked ).value
    }
    
    const jsonInput = document.getElementById('jsonInput').value.trim();
    const fileInput = document.getElementById('fileInput').files[0];

    let isJsonValid = false;

    if (jsonInput) {
        try {
            const jsonArray = JSON.parse(jsonInput);
            if (!Array.isArray(jsonArray)) {
                throw new Error('JSON input is not an array');
            }
            bodyData['data'] = JSON.parse(jsonInput)
            isJsonValid = true;
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Invalid JSON array",
            });
            return;
        }
    }

    if (!isJsonValid && !fileInput) {
        return Swal.fire({
            icon: "error",
            text: 'Either a JSON array or an Excel file is required',
        })
    }

    if(jsonInput && fileInput){
        return Swal.fire({
            icon: "error",
            text: 'Both JSON and Excel file cannot be used at the same time',
        })
    }


    const checkForLogs =() => {
        return setInterval( async () => {
            const {data} = await axios.get(`/api/logs/${reqId}`)
            const logs = data?.data

            if(logs && logs.length){
                responseLogsEl.style.display = 'block'
                responseLogsEl.innerHTML = logs.join('<br>')
                responseLogsEl.scrollIntoView()
            }
        }, 1000 )
    }
    try{
        submitBtn.classList.add('loading')

        var intervalId = checkForLogs();

        const {data} = await axios.post('/api/upload-prod-data', jsonInput ? JSON.stringify(bodyData) : formData, {
            headers: {
                ...jsonInput && {
                    'Content-Type': 'application/json'
                }
            }
        })

        Swal.fire({
            icon: "success",
            text: data?.message,
        });
    }
    catch(err){
        responseEl.className='error'
        if(err?.response?.data){
            return responseEl.textContent = 'Error: ' + err?.response?.data?.message
        }
        responseEl.textContent = 'Error: ' + err.message;
    }   
    finally{
        submitBtn.classList.remove('loading')
        setTimeout( () => {
            clearInterval(intervalId)
        }, 1000 )
    }
});



// Pretty Print
document.getElementById('jsonInput').addEventListener('input', async (e) => {
    document.querySelector('.form-container pre').style.display = 'block'
    const value = e.target.value
    const elem = document.querySelector('.form-container .json-container');
    if(!value){
        return elem.innerHTML = prettyPrintJson.toHtml('')
    }
    try{
        const json = JSON.parse(value)
        const data = json;
        elem.innerHTML = prettyPrintJson.toHtml(data);
    }
    catch(err){
        elem.innerHTML = prettyPrintJson.toHtml('Invalid JSON Input')
    }
})



// DropZone

const setFileDetails = (message) => {
    document.querySelector('.dropzone img').setAttribute('src', 'https://upload.wikimedia.org/wikipedia/commons/3/34/Microsoft_Office_Excel_%282019%E2%80%93present%29.svg');
    document.querySelector('.dropzone span').innerHTML = message;
}
const setFileNull = () => {
    document.querySelector('.dropzone img').setAttribute('src', 'https://wickedev.com/wp-content/uploads/2021/02/cloud-uploading.png');
    document.querySelector('.dropzone span').innerHTML = 'Drop Excel File or Click here to select file to upload.';
}

var dropzone = document.getElementById('dropzone');
var dropzone_input = dropzone.querySelector('.dropzone-input');
var multiple = dropzone_input.getAttribute('multiple') ? true : false;

['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(function(event) {
  dropzone.addEventListener(event, function(e) {
    e.preventDefault();
    e.stopPropagation();
  });
});

dropzone.addEventListener('dragover', function(e) {
  this.classList.add('dropzone-dragging');
}, false);

dropzone.addEventListener('dragleave', function(e) {
  this.classList.remove('dropzone-dragging');
}, false);

dropzone.addEventListener('drop', function(e) {
  this.classList.remove('dropzone-dragging');
  var files = e.dataTransfer.files;
  var dataTransfer = new DataTransfer();
  
  var for_alert = "";
  Array.prototype.forEach.call(files, file => {
    for_alert += `${file.name}  (${file.size} bytes)\r\n`
    dataTransfer.items.add(file);
    if (!multiple) {
      return false;
    }
  });

  var filesToBeAdded = dataTransfer.files;
  dropzone_input.files = filesToBeAdded;
  
  setFileDetails(for_alert)
}, false);

dropzone.addEventListener('click', function(e) {
    setFileNull();
  dropzone_input.click();
});

dropzone_input.addEventListener('change', (e) => {
    const input = e.target;
    if (input.files && input.files[0]) {
        const file = input.files[0];
        const fileDetails = `${file.name}  (${file.size} bytes)\r\n`
        setFileDetails(fileDetails)
    }
})