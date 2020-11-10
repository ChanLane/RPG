using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.AI;

namespace ChandlerLane.Scripts.Mover
{
    
    
    public class Mover : MonoBehaviour
    {
        [SerializeField]
        private GameObject _target;
        private NavMeshAgent _agent;

        private Ray _lastRay;
        
        // Start is called before the first frame update
        void Start()
        {
            if (_agent == null)
            {
                _agent = GetComponent<NavMeshAgent>();
            }

        }

        void Update()
        {
           
            if (Input.GetMouseButtonDown(0))
            {
                MoveToCursor();
            }
            
        }
       
        void MoveToCursor()
        {
            Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
            RaycastHit hitinfo;
            
            if (Physics.Raycast(ray, out hitinfo))
            {
                _agent.destination = hitinfo.point;
            }
        }
    }

}

