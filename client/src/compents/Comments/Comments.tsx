import AddComment from './AddComment'
import CommentList from './CommentList'

interface CommentsProps {
  postId: string
  userId: string
}

export default function Comments( { postId, userId }: CommentsProps) {
  return (
        <div className="flex flex-col flex-1 flex-start">
            <CommentList postId={postId} />
            <AddComment postId={postId} userId={userId} />

        </div>

  )
}
