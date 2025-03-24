import { useEffect, useRef, useState } from "react";
import './css/info.css'
import {mockDescripArr, mockSchedule} from './mock/info'
import Button from "../components/button/button";
import axios from "axios";

const MAX_LENGTH =400;
const url = "http://82.202.138.105:8080/api"

const InfoPage: React.FC = () => {
  const [name, setName] = useState('Mates')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [descripArr, setDescripArr] = useState<any>(mockDescripArr)
  const [imgArr, setImgArr] = useState<(string | null)[]>([])
  const [schedule, setSchedule] = useState(mockSchedule)
  const [activeTab, setActiveTab] = useState<string>('description')
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

    if (textareaRefs.current[index]) {
      textareaRefs.current[index].style.height = 'auto';
      textareaRefs.current[index].style.height = `${textareaRefs.current[index].scrollHeight + 20}px`;
    }
  };

  const deleteDescrip = (index: any) => {
    let newArr = [...descripArr]
    newArr.splice(index, 1)
    setDescripArr(newArr)
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
                onClick={() => setDescripArr(
                  [...descripArr, '']
                )} 
                style={{backgroundColor: 'transparent'}}
              >+</Button>
          </div>
        </div>}
        {activeTab === 'data' && 
          <div className="tab-content">
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
          </div>}
      </div>
    </div>
  )
};

export default InfoPage;
