import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthenticationService } from './authentication.service';

export const authenticationInterceptor: HttpInterceptorFn = (req, next) => {
  const _authenticationService = inject(AuthenticationService);
  const _authenticationToken = _authenticationService.getAuthToken()
  if (_authenticationToken) {
    const request = req.clone({
      setHeaders: {
        authorization: "Bearer " + _authenticationToken,
      }
    })
    return next(request)
  }
  return next(req);
};
