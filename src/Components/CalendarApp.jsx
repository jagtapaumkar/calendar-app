import { useState, useEffect } from "react"
import eventsData from '../data/events.json'

const CalenderApp = () => {
  const daysOfWeek =["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const monthsOfYear = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]
const currentDate = new Date()

const[currentMonth , setCurrentMonth] =useState(currentDate.getMonth())
const[currentYear , setCurrentYear] =useState(currentDate.getFullYear())
const[selectedDate, setSelectedDate] =useState (currentDate)
const [showEventPopup, setshowEventPopup]= useState(false)
const[events,setEvents] =useState([])
const[eventTime, setEventTime]= useState({hours:'00' , minutes:"00"})
const[eventText,setEventText] =useState('')
const[editingEvent, setEditingEvent] =useState(null)

const daysInMonth = new Date (currentYear, currentMonth + 1,0).getDate()
const firstDayOfMonth = new Date(currentYear, currentMonth,1).getDay()

const prevMonth=() =>{
  setCurrentMonth((prevMonth) => (prevMonth === 0 ?11 : prevMonth-1))
  setCurrentYear((prevYear) => (currentMonth ===0 ? prevYear-1 : prevYear))
}
const nextMonth =() =>{
  setCurrentMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth+1))
  setCurrentYear((prevYear) => (currentMonth ===11 ? prevYear+1 : prevYear))
}

const handleDayClick =(day)=>{
  const clickedDate =new Date (currentYear, currentMonth, day)
  const today = new Date()

  if(clickedDate>= today || isSameDay(clickedDate,today)){
    setSelectedDate(clickedDate)
    setshowEventPopup(true)
    setEventTime({hours:'00' , minutes:"00"})
    setEventText("")
    setEditingEvent(null)
  }
}
const isSameDay = (date1, date2) =>{
  return(
    date1.getFullYear() === date2.getFullYear() && 
    date1.getMonth() === date2.getMonth() && 
    date1.getDate() === date2.getDate() 
  )
}

useEffect(() => {
  // Load events from JSON file and convert date strings to Date objects
  const loadedEvents = eventsData.events.map(event => ({
    ...event,
    date: new Date(event.date),
    duration: event.duration || 60, // Default duration of 60 minutes if not specified
  }))
  setEvents(loadedEvents)
}, [])

const handleEventSubmit = () => {
  const newEvent = {
    id: editingEvent ? editingEvent.id : Date.now(),
    date: selectedDate,
    time: `${eventTime.hours.padStart(2, '0')}:${eventTime.minutes.padStart(2, '0')}`,
    text: eventText,
    duration: 60, // Default duration for new events
    description: eventText // Using event text as description for new events
  }

  let updatedEvents = [...events]

  if (editingEvent) {
    updatedEvents = updatedEvents.map((event) =>
      event.id === editingEvent.id ? { ...event, ...newEvent } : event
    )
  } else {
    updatedEvents.push(newEvent)
  }
  updatedEvents.sort((a, b) => new Date(a.date) - new Date(b.date))

  setEvents(updatedEvents)
  setEventTime({ hours: '00', minutes: '00' })
  setEventText('')
  setshowEventPopup(false)
  setEditingEvent(null)
} 
  const handleEditEvent =(event) =>{
    setSelectedDate(new Date(event.date))
    setEventTime({
      hours: event.time.split(':')[0],
      minutes: event.time.split(':')[1],
    })
    setEventText(event.text) 
    setEditingEvent(event)
    setshowEventPopup(true)
  }

  const handleDeleteEvent = (eventId) => {
    const updatedEvents = events.filter((event) => event.id !== eventId)

    setEvents(updatedEvents)
}  
   const handleTimeChange =(e) =>{
    const { name, value } = e.target

    setEventTime((prevTime) => ({... prevTime, [name]: value.padStart(2, '0')}))
   }

  const goToToday = () => {
    setCurrentMonth(currentDate.getMonth())
    setCurrentYear(currentDate.getFullYear())
    setSelectedDate(currentDate)
  }

  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="sidebar-logo">
          <i className="bx bx-calendar-check"></i>
          <span>Calendar</span>
        </div>
        
        <div className="sidebar-menu">
          <div className="menu-item active">
            <i className="bx bx-calendar"></i>
            <span>Calendar</span>
          </div>
          <div className="menu-item">
            <i className="bx bx-task"></i>
            <span>Tasks</span>
          </div>
          <div className="menu-item">
            <i className="bx bx-bell"></i>
            <span>Reminders</span>
          </div>
          <div className="menu-item">
            <i className="bx bx-cog"></i>
            <span>Settings</span>
          </div>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar">
            <i className="bx bx-user-circle"></i>
          </div>
          <div className="user-info">
            <span className="user-name">John Doe</span>
            <span className="user-role">User</span>
          </div>
        </div>
      </div>

      <div className="calendar-app">
        <div className="calendar">
          <h1 className="heading">Calender</h1>
          <button className="today-btn" onClick={goToToday}>
            Today
          </button>
          <div className="navigate-date">
            <h2 className="month">{monthsOfYear[currentMonth]}</h2>
            <h2 className="year">{currentYear}</h2>
            <div className="buttons">
              <i className="bx bx-chevron-left" onClick={prevMonth}></i>
              <i className="bx bx-chevron-right" onClick={nextMonth}></i>
            </div>
          </div>
          <div className="weekdays">
            {daysOfWeek.map((day)=> (
              <span key ={day}>{day}</span>
              ))}
          </div>
          <div className="days">
            {[...Array(firstDayOfMonth).keys()].map((_, index) =>(
            <span key={`empty-${index}`}/> 
            ))}
            {[...Array(daysInMonth).keys()].map((day)=>(
              <span key={day+1} 
              className={day+1 === currentDate.getDate() &&
                 currentMonth===currentDate.getMonth()&&
                  currentYear=== currentDate.getFullYear()
                  ? 'current-day'
                  :''
                }
                onClick={() => handleDayClick (day+1) }
                >
                {day+1}</span>
            ))}
        </div>
        </div>

        <div className="events">
          {showEventPopup && (       
           <div className="event-popup">
            <div className="time-input">
              <div className="event-popup-time">Time</div>
              <input type="number" 
              name="hours" 
              min={0} 
              max={24} 
              className="hours" 
              value={eventTime.hours} 
              onChange={handleTimeChange}
              />
              <input type="number" 
              name="minutes" 
              min={0} max={60} 
              className="minutes" 
              value={eventTime.minutes} 
              onChange={handleTimeChange}
               />
            </div>
            <textarea placeholder="Enter Event Description (maximum 60 characters)" 
            value={eventText} onChange={(e)=>{
              if(e.target.value.length<=60){
                setEventText(e.target.value)
              }
            }}
            >
            </textarea>
            <button className="event-popup-btn" onClick={handleEventSubmit}>{editingEvent ? "Update Event": "Add Event"}</button>
            <button className="close-event-popup" onClick={()=>setshowEventPopup(false)}>
              <i className="bx bx-x" onClick={() => handleDeleteEvent(event.id)}></i>
            </button>
          </div>
        )}
        {events.map((event) => (
          <div className="event" key={event.id}>
            <div className="event-date-wrapper">
              <div className="event-date">{`${monthsOfYear[event.date.getMonth()]}
               ${event.date.getDate()}
               ${event.date.getFullYear()}`}</div>
              <div className="event-time">
                {event.time} ({event.duration} min)
              </div>
            </div>
            <div className="event-title">{event.title || event.text}</div>
            {event.description && (
              <div className="event-description">{event.description}</div>
            )}
            <div className="event-buttons">
              <i className="bx bxs-edit-alt" onClick={() => handleEditEvent(event)}></i>
              <i className="bx bxs-message-alt-x" onClick={() => handleDeleteEvent(event.id)}></i>
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  )
}

export default CalenderApp