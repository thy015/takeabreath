import React, {memo, useState} from 'react'
import PropTypes from "prop-types";
import dayjs from "dayjs";
import {Button} from "antd";

const CommentCard = memo (({comment}) => {
  const [showFullContent, setShowFullContent] = React.useState (false);
  CommentCard.propTypes = {
    comment: PropTypes.object.isRequired,
  }
  CommentCard.displayName = "CommentCard";

  const formattedCreatedDay = dayjs (comment.createdDay).format ('DD/MM/YYYY');
  let contentToDisplay
  if (showFullContent) {
    contentToDisplay = comment.content;
  } else if (comment.content.length > 200) {
    contentToDisplay = `${comment.content.slice (0, 200)}...`;
  } else {
    contentToDisplay = comment.content;
  }
  return (
    <section className='w-full transition-all duration-500 ease-in h-auto border flex flex-col p-4 mb-4 rounded-lg'>
      {/*Rate point*/}
      <div className='flex-between'>
        <div className='text-xl font-bold'>{comment.ratePoint}/5</div>
        <div className='flex flex-col text-right'>
          <div className='font-semibold font-afacad'>{comment.cusID.cusName}</div>
          <div>{comment.cusID.email}</div>
        </div>
      </div>
      {/*  Date and content --IF content > 200 char => SLICE*/}
      <div>
        {formattedCreatedDay}
      </div>
      <div className='w-[80%] text-wrap'>
        {contentToDisplay}

        {comment.content.length > 200 && (
          <div className='underline font-bold text-md font-afacad'
               onClick={() => setShowFullContent (!showFullContent)}>
            {showFullContent ? 'See less' : 'See more'}
          </div>
        )}
      </div>
    </section>
  )
})

const CommentList = ({comments}) => {

  CommentList.propTypes = {
    comments: PropTypes.array.isRequired,
  }
  const [showMoreComments, setShowMoreComments] = useState (1);

  const handleShowMoreComments = () => {
    setShowMoreComments ((prevState) => Math.min (prevState + 3, comments.length));
  };
  return (
    <>
      {comments.length > 0 && comments.slice (0, showMoreComments).map (comment => (
        <div key={comment.id}>
          <CommentCard comment={comment}></CommentCard>
          {showMoreComments < comments.length && (
            <div className='flex justify-end items-center'>
              <Button className='mt-2'
                      onClick={handleShowMoreComments}>Show more</Button>
            </div>
          )}
        </div>
      ))}
    </>
  )
}

export {CommentCard, CommentList}
