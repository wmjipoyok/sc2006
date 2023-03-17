// read local JSON file in javascript
function lol(){
    function saveText(text, filename){
        var a = document.createElement('a');
        a.setAttribute('href', 'data:text/plain;charset=utf-8,'+encodeURIComponent(text));
        a.setAttribute('download', filename);
        a.click()
    }
    
    fetch("D:/NTU WORK/Y2S2/Software Engineering/carparkAPIdetails.json")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            
            var cleaned = [];
            for(var key in data.Result){
                
                cleaned.push({

                    id: key,
                    name: data.Result[key].ppName,
                    geometrics: data.Result[key].geometries
                });
                
            }
            console.log(cleaned);
            saveText(JSON.stringify(cleaned), "carparkAPIdetails-cleaned.json");
        })
       
        
    }