import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class PolicyService {
  public _API = environment.apiUrl;
  constructor(private _http: HttpClient) {}
policies:any=[];
activePolicies:any=[];

  fetchPolicies() {
    return this._http.get(`${this._API}/admin/get_master_policy`);
  }

  fetchActivePolicy() {
    return this._http.get(`${this._API}/admin/get_active_master_policy`);
  }

  fetchPolicyById(Id) {
    return this._http.get(`${this._API}/admin/get_master_policy_by_id/${Id}`);
  }
  createPolicy(newPolicy) {
    return this._http.post(`${this._API}/admin/add_master_policy`, newPolicy);
  }
  updatePolicy(updatedPolicy) {
    return this._http.put(
      `${this._API}/admin/edit_master_policy`,
      updatedPolicy
    );
  }

  deletePolicyById(policy_id) {
    return this._http.delete(
      `${this._API}/admin/delete_master_policy/${policy_id}`
    );
  }
  removePolicyById(policy_id, policy) {
    return this._http.put(
      `${this._API}/admin/remove_master_uom/${policy_id}`,
      policy
    );
  }
}
