export const HandleImageUpload = async(file, type="single", fieldName="image") => {
try {
    const formData = new FormData()

    if(type === "single"){
      if(!file[0]) throw new Error("No file uploaded")
          formData.append(fieldName, file[0])
    }
    if(type==='multiple'){
      if(!file.length) throw new Error("No files are selected")
         Array.from(file).forEach((file, index) => {
          formData.append("images", file)
      })
    }
} catch (error) {
    console.log(error);
    
}
}