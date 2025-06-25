interface Props {
    title: string
    onConfirm: () => void
    onCancel: () => void
}
export default function RemoveModal({ title, onConfirm, onCancel }: Props) {
  return (
    <div className="remove-modal">
        <div className="remove-modal-content">
        <div className="flex flex-col">
            <span className="text-semibold mb-4">{title}</span>
            <div className="flex flex-row flex-end mt-4">
                <button className="btn btn-danger mr-2" onClick={onConfirm}>Delete</button>
                <button className="btn " onClick={onCancel}>Cancel</button>
            </div>
        </div>
        </div>
    </div>
  )
}
 