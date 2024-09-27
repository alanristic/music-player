/**
 * Utility functions that assists me with basic tasks
 */

export default {
  formatTime(time) {
    const minutes = Math.floor(time / 60) // number of minutes
    const seconds = Math.floor(time % 60) // number of seconds (leftover from minutes)
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`
  }
}
