using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace ChandlerLane.Scripts.FollowCamera
{
    
    public class FollowCamera : MonoBehaviour
    {
        [SerializeField]
        private GameObject _target;
        
        // Start is called before the first frame update
        void Start()
        {

        }

        // Update is called once per frame
        void Update()
        {
            this.transform.position = _target.transform.position;
        }
    }

}
