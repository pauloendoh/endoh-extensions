import { getHighestVotes } from './listeners/content_script/github-issues/getHighestVotes'
import { content_checkAndOpenResourceModal } from './listeners/content_script/relearn/content_checkAndOpenResourceModal'
import { content_initReactApp } from './listeners/content_script/relearn/content_initReactApp'
import { content_toggleLinkScan } from './listeners/content_script/relearn/content_toggleLinkScan'
import { csHideRelearnButton } from './listeners/content_script/relearn/csHideRelearnButton'
import { messageTypes } from './utils/messageTypes'

let currentComment: HTMLElement | null = null

// get runtime tab

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.type === messageTypes.getHighestVotes) {
    return getHighestVotes(sendResponse)
  }

  if (msg.type === messageTypes.scrollToComment) {
    const commentId = msg.commentId

    const comment = document
      .getElementById(commentId)
      ?.querySelector('.comment-reactions') as HTMLElement | null
    if (comment) {
      if (currentComment) {
        currentComment.style.border = 'none'
      }
      currentComment = comment
      comment.style.border = '4px solid #8957e5'

      const y = comment.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: y - 200,
        behavior: 'smooth',
      })
    }
    sendResponse('Scroll to comment')
    return
  }

  if (msg.type === messageTypes.alert) {
    alert(msg.message)
  }

  if (msg.type === messageTypes.initReactApp) {
    content_initReactApp(msg.tabId)
  }

  if (msg.type === messageTypes.foundResource) {
    window.dispatchEvent(
      new CustomEvent(messageTypes.foundResource, {
        detail: {
          resource: msg.resource,
        },
      })
    )
  }

  if (msg.type === messageTypes.hideRelearnButton) {
    csHideRelearnButton()
  }

  if (msg.type === messageTypes.toggleLinkScan) {
    content_toggleLinkScan(msg.tabId)
  }

  if (msg.type === messageTypes.checkAndOpenResourceModal) {
    content_checkAndOpenResourceModal(msg.url)
  }
})
