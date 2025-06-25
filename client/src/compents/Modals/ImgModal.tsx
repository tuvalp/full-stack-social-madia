import { BASE_URL } from "../../Api/Config";

interface Props {
    onClose: () => void
    img: string
}
export default function ImgModal({ onClose, img }: Props) {
  return (
    <div className="img-modal">
        <button className="btn btn-icon close" onClick={onClose}><i className="fa fa-close"></i></button>
        <img src={`${BASE_URL}${img}`}  />     
    </div>
  )
}
