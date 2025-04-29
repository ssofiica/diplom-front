import React, { useState } from 'react';
import {minio} from '../../../const/const'
import './info.css'

interface InfoBarProps {
  descrip: string[];
  img: string[];
}

const TextImageDisplay: React.FC<InfoBarProps> = ({descrip, img}) => {
    const [texts, setTexts] = useState<string[]>(descrip);
    const [images, setImages] = useState<string[]>(img);

    
    const maxLength = Math.max(texts.length, images.length);
    const displayItems = [];
    
    if (images.length === 2) {
        displayItems.push(<p key={`text-${0}`} className="type-1">{texts[0]}</p>)
        displayItems.push(
            <div className="two-img-row">
                <img key={`image-${0}`} src={minio+images[0]} alt={`Image ${0 + 1}`}/>
                <img key={`image-${1}`} src={minio+images[1]} alt={`Image ${1 + 1}`}/>
            </div>
        );
        displayItems.push();
        for (let i = 1; i < texts.length; i++) {
            displayItems.push(<p key={`text-${i}`} className="type-2">{texts[i]}</p>);
        }
    } else {
        for (let i = 0; i < maxLength; i++) {
            if (i < texts.length) {
                displayItems.push(<p key={`text-${i}`}>{texts[i]}</p>);
            }
            if (i < images.length) {
                displayItems.push(<img key={`image-${i}`} src={minio+images[i]} alt={`Image ${i + 1}`} style={{ width: '100%', height: 'auto' }} />);
            }
        }
    }

    return (
        <div>
            {displayItems}
        </div>
    );
};

export default TextImageDisplay;
