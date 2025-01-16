import React from 'react'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser, } from '@/config/ChatLogics'
import { ChatState } from '@/Context/ChatProvider'
import { Tooltip } from '@/components/ui/tooltip';
import { Avatar } from '@/components/ui/avatar';

function ScrollableChat( {messages} ) {
  const { user } = ChatState();
  //console.log(messages)
  return (
      <div style={{ overflowX: "hidden", overflowY: "auto" }}>
        {messages &&
          messages.map((m, i) => (
            <div style={{ display: "flex",color:"black" }} key={m._id}>
              {(isSameSender(messages, m, i, user._id) || isLastMessage(messages, i, user._id)) && (
                <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                  <Avatar
                    mt="7px"
                    mr={1}
                    size="sm"
                    cursor="pointer"
                    name={m.sender.name}
                    src={m.sender.pic}
                  />
                </Tooltip>
              )}
              {/* Render message content */}
              <span
              style={{background:`${m.sender._id===user._id?"#BEF3F8":"#B9F5D0"}`,
            borderRadius:"20px",
          padding:"5px 15px",
        maxWidth:"75%",
      marginLeft:isSameSenderMargin(messages,m,i,user._id),
    marginTop:isSameUser(messages,m,i,user._id)?3:10}}
              >{m.content}</span>
            </div>
          ))}
      </div>
    
  );
}
export default ScrollableChat