from typing import Any, Text, Dict, List

from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher

import requests
import json

from datetime import datetime, timedelta

def nearest_weekday(d, weekday):
    days_til_target = (weekday - d.weekday() + 7) % 7
    return d + timedelta(days=days_til_target)

def date_from_day(day, time):
    days_of_week = {
        'monday': 0,
        'tuesday': 1,
        'wednesday': 2,
        'thursday': 3,
        'friday': 4,
        'saturday': 5,
        'sunday': 6
    }

    current_day = datetime.now().date()
    weekday_number = days_of_week[day]

    nearest_day = nearest_weekday(current_day, weekday_number)
    formatted_result = f"{nearest_day}T{time}:00.000Z"

    return formatted_result


api_url_nt = "http://localhost:3001/api/newcommitments"

def new_task(task_name, task_days, task_start_time, task_end_time, recurrency, category):

    payloads = []
    for day in task_days.split(','):
        day = day.strip().lower()
        payload = {
            "name": task_name,
            "startDateTime": date_from_day(day, task_start_time),
            "endDateTime": date_from_day(day, task_end_time),
            "recurrency": recurrency,
            "category": category,
            "userId": 1
        }

        payloads.append(payload)

        json_payload = json.dumps(payloads)

    headers = {'Content-Type': 'application/json'}

    response = requests.post(api_url_nt, data=json_payload, headers=headers)

    if response.status_code == 201:
        print("Request successful!")
        print("Response content:", response.text)
    else:
        print(f"Request failed with status code {response.status_code}")
        print("Error message:", response.text)


class WorkHabitsAction(Action):

    def name(self) -> Text:
        return "action_work_habits"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        task_entity = next(tracker.get_latest_entity_values("task"), None)
        day_entity = next(tracker.get_latest_entity_values("day"), None)
        ts_entity = next(tracker.get_latest_entity_values("time_start"), None)
        te_entity = next(tracker.get_latest_entity_values("time_end"), None)

        new_task(task_entity, day_entity, ts_entity, te_entity, "WEEKLY", "Work")

        dispatcher.utter_message("When do you prefer studying? When do you usually begin and for how long?")

        return []
    
class StudyHabitsAction(Action):

    def name(self) -> Text:
        return "action_study_habits"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        task_entity = next(tracker.get_latest_entity_values("task"), None)
        day_entity = next(tracker.get_latest_entity_values("day"), None)
        ts_entity = next(tracker.get_latest_entity_values("time_start"), None)
        te_entity = next(tracker.get_latest_entity_values("time_end"), None)

        new_task(task_entity, day_entity, ts_entity, te_entity, "WEEKLY", "Study")
        
        dispatcher.utter_message("Tell me about your hobbies... Which and when do you have some?")

        return []
    
class FreeTimeHabitsAction(Action):

    def name(self) -> Text:
        return "action_freetime_habits"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        task_entity = next(tracker.get_latest_entity_values("task"), None)
        day_entity = next(tracker.get_latest_entity_values("day"), None)
        ts_entity = next(tracker.get_latest_entity_values("time_start"), None)
        te_entity = next(tracker.get_latest_entity_values("time_end"), None)

        new_task(task_entity, day_entity, ts_entity, te_entity, "WEEKLY", "Free-time")
        
        dispatcher.utter_message("Ok now, when do you usually have dinner?")

        return []
    
class MealsHabitsAction(Action):

    def name(self) -> Text:
        return "action_meals_habits"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        task_entity = next(tracker.get_latest_entity_values("task"), None)
        day_entity = next(tracker.get_latest_entity_values("day"), None)
        ts_entity = next(tracker.get_latest_entity_values("time_start"), None)
        te_entity = next(tracker.get_latest_entity_values("time_end"), None)

        new_task(task_entity, day_entity, ts_entity, te_entity, "WEEKLY", "Free-time")
        
        dispatcher.utter_message("Do you prioritize work or studying?")

        return []
    
class PriorityHabitsAction(Action):

    def name(self) -> Text:
        return "action_priority_habits"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        
        dispatcher.utter_message("I think we're done!")

        return []
    
class AddTask(Action):

    def name(self) -> Text:
        return "action_add_task"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        task_entity = next(tracker.get_latest_entity_values("task"), None)
        day_entity = next(tracker.get_latest_entity_values("day"), None)
        ts_entity = next(tracker.get_latest_entity_values("time_start"), None)
        te_entity = next(tracker.get_latest_entity_values("time_end"), None)

        new_task(task_entity, day_entity, ts_entity, te_entity, "", "Free-time")

        dispatcher.utter_message("Task inserted!")
        return []
    
class AddTaskConflict(Action):

    def name(self) -> Text:
        return "action_add_task_conflict"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        new_task("hang out with friends", "saturday", "22:00", "23:00", "", "Free-time")

        dispatcher.utter_message(f"Task inserted!")

        return []