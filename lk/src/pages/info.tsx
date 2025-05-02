import { useEffect, useRef, useState } from "react";
import './css/info.css'
import {mockDescripArr, mockSchedule} from './mock/info'
import Button from "../components/button/button";
import axios from "axios";
import {url} from '../const/const'

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
  const [files, setFiles] = useState<File[]>([]);
  const [changedDescriptions, setChangedDescriptions] = useState<boolean[]>([false]); // 

  const textareaRefs = useRef<HTMLTextAreaElement[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchInfo = async () => {
    try {
      const response = await axios.get(`${url}/info`)
      if (response.status === 200) {
        setName(response.data.name)
        setAddress(response.data.address)
        setPhone(response.data.phone)
        setDescripArr(response.data.description)
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

  const handleInput = (event: React.FormEvent<HTMLTextAreaElement>, index: any) => {
    const target = event.target as HTMLTextAreaElement;
    let newArr = [...descripArr]
    if (target.value.length > MAX_LENGTH) {
      newArr[index] = target.value.slice(0, MAX_LENGTH)
    } else {
      newArr[index] = target.value
    }
    setDescripArr(newArr)
    const newChangedDescriptions = [...changedDescriptions];
    newChangedDescriptions[index] = true;
    setChangedDescriptions(newChangedDescriptions);

    if (textareaRefs.current[index]) {
      textareaRefs.current[index].style.height = 'auto';
      textareaRefs.current[index].style.height = `${textareaRefs.current[index].scrollHeight + 20}px`;
    }
  };

  const saveBase = async () => {
    try {
      const body: Record<string, any> = {};
      if (oldBase?.name != name) body.name = name;
      if (oldBase?.address != address) body.address = address;
      if (oldBase?.phone != phone) body.phone = phone;
      if (oldBase?.email != email) body.email = email; 
      console.log(oldBase?.email, email)
      console.log(body)
      const resp = await axios.post(`${url}/info/base`, body);
      return resp
    } catch (error) {
      console.log("Ошибка в удалении блюда", error)
    }
  };

  const uploadLogo = async () => {
    if (!logoFile) return
    try {
      const formData = new FormData();
      formData.append('logo_url', logoFile)
      const resp = await axios.post(`${url}/info/upload_logo${rest_id}`, formData, {headers: {
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
      descripArr.forEach((description: string, index: number) => {
        if (changedDescriptions[index]) {
          numsD.push(index+1)
          text.push(description)
        }
      });
      if (changedDescriptions) {
        formData.append('descriptions', JSON.stringify(text));
        formData.append('descrip_indexes', JSON.stringify(numsD));
      }
      
      //TODO: в files должны храниться фотки и отправлять измененные
      const numsF: number[] = []
      files.forEach((file: any, index: number) => {
        formData.append('images', file); 
        numsF.push(index+1)
      });
      formData.append('img_indexes', JSON.stringify(numsF));

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
    newArr.splice(index, 1)
    setDescripArr(newArr)
    // TODO: запрос на удаление описания
  }

  const addImageButton = () => {
    setImgArr([...imgArr, ''])
    if (fileInputRef.current) {
        fileInputRef.current.click(); // Открываем диалог выбора файла
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, index: any) => {
    const file = event.target.files?.[0];
    // TODO: загрузить в minio 
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
          let newArr = [...imgArr]
          newArr[index] = reader.result as string
          setImgArr(newArr)
      };
      reader.readAsDataURL(file); 
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
          <div>Фото</div>
          {imgArr.map((item:any, index:any) => (
            <img src={item} style={{width: '40px', height: '40px'}}/>
          ))}
          <input
            type="file"
            onChange={(e) => handleFileChange(e, imgArr.length-1)}
            accept="image/*" // Укажите типы файлов, которые вы хотите разрешить
            style={{ display: 'none' }}
            ref={fileInputRef}
          />
          <Button onClick={addImageButton} 
              style={{backgroundColor: 'transparent'}}
          >+</Button>
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
                  setChangedDescriptions([...changedDescriptions, false]);
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
                    src={previewUrl} 
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