"""Test utility functions and decorators"""
import pytest


def test_handle_notion_errors_decorator():
    from src.utils.decorators import handle_notion_errors
    
    assert handle_notion_errors is not None
    assert callable(handle_notion_errors)


def test_database_helper_exists():
    from src.service.database import helper
    
    assert helper is not None
