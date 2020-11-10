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
            _agent.destination = _target.transform.position;
            
            if (Input.GetMouseButtonDown(0))
            {
                _lastRay = Camera.main.ScreenPointToRay(Input.mousePosition);
            }
            Debug.DrawRay(_lastRay.origin, _lastRay.direction * 100);    
        }
    }

}

