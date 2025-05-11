import { useEffect, useRef, useState } from "react";
import './css/info.css'
import {mockDescripArr, mockSchedule} from './mock/info'
import Button from "../components/button/button";
import axios from "axios";
import {url, minio} from '../const/const'

const MAX_LENGTH=400;
const rest_id = 1

interface Base {
  name: string;
  phone: string;
  email: string;
  address: string;
  logo: string;
}

const InfoPage: React.FC = () => {
  const [name, setName] = useState('Mates')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [descripArr, setDescripArr] = useState<any>(mockDescripArr)
  const [imgArr, setImgArr] = useState<(string | null)[]>([])
  const [logo, setLogo] = useState('http://localhost:9000/images/restaurant/1/logo_url.png')
  const [schedule, setSchedule] = useState(mockSchedule)
  const [activeTab, setActiveTab] = useState<string>('description')
  
  const [previewUrl, setPreviewUrl] = useState<string | null>(logo);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [oldBase, setOldBase] = useState<Base>({name: '', phone: '', email: '', address: '', logo: ''});
  const [files, setFiles] = useState<any[]>([]);
  const [copyDescripArr, setCopyDescripArr] = useState<any>([])
  const [changedDescriptionsIndx, setChangedDescriptionsIndx] = useState<boolean[]>([false]);
  const [changedImgs, setChangedImgs] = useState<number[]>([]);

  const textareaRefs = useRef<HTMLTextAreaElement[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchInfo = async () => {
    try {
      const response = await axios.get(`${url}/info`)
      if (response.status === 200) {
        console.log(response.data)
        setName(response.data.name)
        setAddress(response.data.address)
        setPhone(response.data.phone)
        setDescripArr(response.data.description)
        setCopyDescripArr(response.data.description)
        let arr = response.data.img_urls
        setImgArr(arr.map((url: string) => minio+url))
        setEmail(response.data.email)
        setLogo(response.data.logo_url)
        setOldBase((prev: any) => ({
          ...prev,
          logo: response.data.logo_url,
          name: response.data.name,
          email: response.data.email,
          address: response.data.address,
          phone: response.data.phone,
        }));
      }
    } catch (error) {
      console.log("Ошибка в получении меню", error)
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const saveBase = async () => {
    try {
      const body: Record<string, any> = {};
      if (oldBase?.name != name) body.name = name;
      if (oldBase?.address != address) body.address = address;
      if (oldBase?.phone != phone) body.phone = phone;
      if (oldBase?.email != email) body.email = email; 
      console.log(oldBase?.email, email)
      console.log(body)
      if (Object.keys(body).length > 0) {
        const resp = await axios.post(`${url}/info/base`, body);
        return resp
      }
      return
    } catch (error) {
      console.log("Ошибка в удалении блюда", error)
    }
  };

  const uploadLogo = async () => {
    if (!logoFile) return
    try {
      const formData = new FormData();
      formData.append('logo_url', logoFile)
      const resp = await axios.post(`${url}/info/upload-logo`, formData, {headers: {
        'Content-Type': 'multipart/form-data',
      }});
      return resp
    } catch (error) {
      console.log("Ошибка в удалении блюда", error)
    }
  };
  
  const handleSaveBase = async () => {
    if (logoFile) {
      const resp = await uploadLogo();
      if (resp?.status === 200) {
        console.log("ok")
      }
    }
    const resp = await saveBase();
    if (resp?.status === 200) {
      setName(resp.data.name)
      setAddress(resp.data.address)
      setPhone(resp.data.phone)
      setEmail(resp.data.email)
    }
  } 

  const saveDescripAndImgs = async () => {
    try {
      const formData = new FormData();
      const numsD: number[] = []
      const text: string[] = []
      console.log(changedDescriptionsIndx, copyDescripArr)
      copyDescripArr.forEach((description: string, index: number) => {
        if (changedDescriptionsIndx[index]) {
          numsD.push(index+1)
          console.log(text)
          text.push(description)
        }
      });
      if (changedDescriptionsIndx) {
        formData.append('descriptions', JSON.stringify(text));
        formData.append('descrip_indexes', JSON.stringify(numsD));
      } else if (!changedImgs) {
        return
      }
      
      files.forEach((file: any, index: number) => {
        console.log(index)
        formData.append('images', file); 
      });
      if (changedImgs) {
        formData.append('img_indexes', JSON.stringify(changedImgs));
        console.log(changedImgs)
      }

      const resp = await axios.post(`${url}/info/site-content`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return resp
    } catch (error) {
      console.log("Ошибка в удалении блюда", error)
    }
  };

  const handleSaveDescripAndImgs = async () => {
    const resp = await saveDescripAndImgs();
    if (resp?.status === 200) {
      console.log(resp.data)
      setFiles([])
      setChangedImgs([])
      setChangedDescriptionsIndx([])
    }
  }

  const handleSaveSchedule = async () => {
    const resp = await saveDescripAndImgs();
    if (resp?.status === 200) {
      console.log(resp.data)
    }
  }

  const deleteDescrip = (index: any) => {
    let newArr = [...descripArr]
    let copyArr = [...descripArr]
    copyArr[index] = ""
    setCopyDescripArr(copyArr)
    newArr.splice(index, 1)
    setDescripArr(newArr)
    const newChangedDescriptionsIndx = [...changedDescriptionsIndx];
    newChangedDescriptionsIndx[index] = true;
    setChangedDescriptionsIndx(newChangedDescriptionsIndx);
  }

  const deleteImg = (index: any) => {
    let newArr = [...imgArr]
    newArr.splice(index, 1)
    setImgArr(newArr)

    let arr = [...files, ""]
    setFiles(arr)
    const newChangedImgs = [...changedImgs, index+1];
    setChangedImgs(newChangedImgs);
    console.log(arr, newChangedImgs)
  }

  const addImageButton = () => {
    setImgArr([...imgArr, ''])
    if (fileInputRef.current) {
        fileInputRef.current.click(); // Открываем диалог выбора файла
    }
  };

  const handleInput = (event: React.FormEvent<HTMLTextAreaElement>, index: any) => {
    const target = event.target as HTMLTextAreaElement;
    let newArr = [...descripArr]
    if (target.value.length > MAX_LENGTH) {
      newArr[index] = target.value.slice(0, MAX_LENGTH)
    } else {
      newArr[index] = target.value
    }
    setDescripArr(newArr)
    setCopyDescripArr(newArr)
    const newChangedDescriptionsIndx = [...changedDescriptionsIndx];
    newChangedDescriptionsIndx[index] = true;
    setChangedDescriptionsIndx(newChangedDescriptionsIndx);

    if (textareaRefs.current[index]) {
      textareaRefs.current[index].style.height = 'auto';
      textareaRefs.current[index].style.height = `${textareaRefs.current[index].scrollHeight + 20}px`;
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, index: any) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
          let newArr = [...imgArr]
          newArr[index] = reader.result as string
          setImgArr(newArr)
      };
      reader.readAsDataURL(file); 

      let arr = [...files, file]
      setFiles(arr)
      const newChangedImgs = [...changedImgs, index+1];
      setChangedImgs(newChangedImgs);
      console.log(arr, newChangedImgs)
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);

      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScheduleChange = (event: React.ChangeEvent<HTMLInputElement>, index: any, start: boolean) => {
    const time = event.target.value
    let newArr = [...schedule]
    if (start){
      newArr[index].open_time = time
    } else {
      newArr[index].close_time = time
    }
    setSchedule(newArr)
  };

  return (
    <div className="info">
      <div style={{display: 'flex', gap: '2em'}}>
        <p 
          onClick={() => setActiveTab('data')}
          className="tab"
          style={{
            fontWeight: activeTab === 'data' ? '500' : '',
          }}>
            Данные
        </p>
        <p onClick={() => setActiveTab('description')}
           className="tab"
           style={{
            fontWeight: activeTab === 'description' ? '500' : '',
          }}>
          Содержимое сайта
        </p>
        <p onClick={() => setActiveTab('schedule')} 
           className="tab"
           style={{
            fontWeight: activeTab === 'schedule' ? '500' : '',
          }}>
          Расписание
        </p>
      </div>
      <div>
        {activeTab === 'description' && 
        <div className="tab-content">
          <div style={{marginBottom: 10}}>Фото</div>
          <div className="images" style={{display: 'flex', gap: 20}}>
            {imgArr.map((item:any, index:any) => (
              <div style={{display: 'flex', width: '150px', flexDirection: 'column'}}>
                <img src={item} style={{width: '150px', height: '150px', marginBottom: 10}}/>
                <Button 
                  onClick={() => deleteImg(index)}
                >-</Button>
              </div>
            ))}
          <input
            type="file"
            onChange={(e) => handleFileChange(e, imgArr.length-1)}
            accept="image/*"
            style={{ display: 'none' }}
            ref={fileInputRef}
            />
          <Button onClick={addImageButton} 
              style={{backgroundColor: 'transparent'}}
          >+</Button>
          </div>
          <div className="descriptions">
            <div>Описания</div>
            {descripArr.map((item:any, index:any) => (
              <div style={{display: 'flex', justifyContent: 'flex-start'}}>
                <div className="area-container">
                  <textarea key={index}
                    ref={(el) =>{ textareaRefs.current[index] = el!}}
                    value={item}
                    onInput={(e) => handleInput(e, index)}
                    placeholder="Введите текст..."
                  />
                  <div className="symbols" style={{color: item.length > MAX_LENGTH ? 'red' : 'black' }}>
                    {item.length}/{MAX_LENGTH}
                  </div>
                </div>
                <Button 
                  onClick={() => deleteDescrip(index)} 
                  style={{marginLeft: '10px', }}
                >-</Button>
              </div>))}
              <Button 
                onClick={() => {
                  setDescripArr([...descripArr, '']);
                  setCopyDescripArr([...descripArr, '']);
                  setChangedDescriptionsIndx([...changedDescriptionsIndx, false]);
                }}
                style={{backgroundColor: 'transparent'}}
              >+</Button>
              <Button onClick={handleSaveDescripAndImgs}>Сохранить</Button>
          </div>
        </div>}
        {activeTab === 'data' && 
          <div className="tab-content">
            <div>
              <input
                type="file"
                ref={logoInputRef}
                onChange={handleLogoChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
              {previewUrl && (
                <div className="preview">
                  <img 
                    src={minio+logo} 
                    alt="Preview" 
                    style={{ maxWidth: '300px', maxHeight: '300px' }}
                  />
                </div>
              )}
              <Button onClick={() => logoInputRef.current?.click()}>Загрузить логотип</Button>
            </div>
            <div>
              <p style={{marginBottom: '0.6em', fontSize: '16px'}}>Название заведения</p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
              />
            </div>
            <div style={{marginTop: '1em'}}>
              <p style={{marginBottom: '0.6em'}}>Адрес</p>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="input"
              />
            </div>
            <div style={{marginTop: '1em'}}>
              <p style={{marginBottom: '0.6em'}}>Телефон</p>
              <input
                type="text"
                value={phone}
                maxLength={13}
                onChange={(e) => setPhone(e.target.value)}
                className="input"
              />
            </div>
            <Button onClick={handleSaveBase}>Сохранить</Button>
          </div>}
        {activeTab === 'schedule' && 
          <div className="tab-content">
            {schedule.map((item:any, index:any) => (<>
              <div style={{display: 'flex', gap: '10px'}}>
                <p style={{width: '20px'}}>{item.day}</p>
                <input
                  type="time"
                  value={item.open_time}
                  placeholder="00:00"
                  maxLength={5}
                  pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]"
                  onChange={(e) => handleScheduleChange(e, index, true)}
                  className="input"
                />
                <p>-</p>
                <input
                  type="time"
                  value={item.close_time}
                  placeholder="00:00"
                  maxLength={5}
                  pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]"
                  onChange={(e) => handleScheduleChange(e, index, false)}
                  className="input"
                />
              </div>
            </>))}
            <Button onClick={handleSaveSchedule}>Сохранить</Button>
          </div>}
      </div>
    </div>
  )
};

export default InfoPage;