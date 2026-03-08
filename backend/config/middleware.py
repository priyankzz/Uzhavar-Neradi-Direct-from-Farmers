# backend/config/middleware.py
class RequestLogMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # don’t print here (user not authenticated yet)
        response = self.get_response(request)
        return response

    def process_view(self, request, view_func, view_args, view_kwargs):
        # User is authenticated here
        print(f"User: {request.user} | Agent: {request.META.get('HTTP_USER_AGENT')}")